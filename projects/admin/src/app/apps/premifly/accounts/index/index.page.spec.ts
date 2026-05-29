import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { of } from "rxjs";
import { IndexPage } from "./index.page";
import { PremiflyAccount, type Paginated, type Model } from "shared";

describe("IndexPage", () => {
	let component: IndexPage;
	let fixture: ComponentFixture<IndexPage>;
	let premiflyAccountSpy: jasmine.SpyObj<PremiflyAccount>;
	let routerSpy: jasmine.SpyObj<Router>;
	let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

	const mockAccounts: Paginated<Model.Premifly.Account> = {
		data: [
			{
				id: "acc-1",
				email: "john@example.com",
				password: "securepassword",
				code: "TOKEN-100",
				expires_at: "2026-12-31T23:59:59.000Z",
				subscriptions_count: 5,
				created_at: "2026-05-22T10:00:00.000Z",
				updated_at: "2026-05-22T10:00:00.000Z",
			},
			{
				id: "acc-2",
				email: "jane@example.com",
				password: "anotherpassword",
				code: "TOKEN-200",
				expires_at: null,
				subscriptions_count: 0,
				created_at: "2026-05-22T11:00:00.000Z",
				updated_at: "2026-05-22T11:30:00.000Z",
			},
		],
		meta: {
			per_page: 5,
			total: 2,
			current_page: 1,
			from: 1,
			to: 2,
		},
		links: {},
	};

	beforeEach(async () => {
		premiflyAccountSpy = jasmine.createSpyObj("PremiflyAccount", ["delete"]);
		routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
		snackBarSpy = jasmine.createSpyObj("MatSnackBar", ["open"]);

		await TestBed.configureTestingModule({
			imports: [IndexPage, NoopAnimationsModule],
			providers: [
				{ provide: PremiflyAccount, useValue: premiflyAccountSpy },
				{ provide: Router, useValue: routerSpy },
				{ provide: MatSnackBar, useValue: snackBarSpy },
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: {
							queryParams: {},
						},
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexPage);
		component = fixture.componentInstance;

		// Set the required signal input
		fixture.componentRef.setInput("accounts", mockAccounts);

		fixture.detectChanges();
	});

	it("should create component", () => {
		expect(component).toBeTruthy();
	});

	it("should compute total subscriptions correctly", () => {
		expect(component.totalSubscriptions()).toBe(5);
	});

	it("should navigate with query parameters when paginator page triggers", () => {
		component.handlePaginatorEvent({
			pageIndex: 1,
			pageSize: 10,
			length: 100,
		});
		expect(routerSpy.navigate).toHaveBeenCalledWith([], {
			queryParams: { page: 2, limit: 10 },
		});
	});

	it("should navigate to edit account path on edit click", () => {
		const event = jasmine.createSpyObj("Event", ["stopPropagation"]);
		component.editAccount(mockAccounts.data![0], event);

		expect(event.stopPropagation).toHaveBeenCalled();
		expect(routerSpy.navigate).toHaveBeenCalledWith(
			["..", "account", "acc-1", "edit"],
			jasmine.any(Object),
		);
	});

	it("should handle double-confirmation delete flow and clear confirmation after 4s", fakeAsync(() => {
		const event = jasmine.createSpyObj("Event", ["stopPropagation"]);
		premiflyAccountSpy.delete.and.returnValue(of({}));

		// First click should activate delete confirmation status
		component.deleteAccount(mockAccounts.data![0], event);
		expect(event.stopPropagation).toHaveBeenCalled();
		expect(component.confirmDeleteId()).toBe("acc-1");
		expect(premiflyAccountSpy.delete).not.toHaveBeenCalled();

		// Fast forward 4 seconds - confirmation should auto-revert
		tick(4000);
		expect(component.confirmDeleteId()).toBeNull();

		// Trigger first click again
		component.deleteAccount(mockAccounts.data![0], event);
		expect(component.confirmDeleteId()).toBe("acc-1");

		// Second click should execute actual deletion API and notify user
		component.deleteAccount(mockAccounts.data![0], event);
		expect(premiflyAccountSpy.delete).toHaveBeenCalledWith("acc-1");
		expect(component.confirmDeleteId()).toBeNull();
	}));

	it("should copy password to clipboard and show feedback checkmark for 2s", fakeAsync(() => {
		const spyClipboard = spyOn(navigator.clipboard, "writeText").and.returnValue(Promise.resolve());
		const event = jasmine.createSpyObj("Event", ["stopPropagation"]);

		component.copyToClipboard("securepassword", "Password", "acc-1", "password", event);

		expect(event.stopPropagation).toHaveBeenCalled();
		expect(spyClipboard).toHaveBeenCalledWith("securepassword");

		// Wait for promise resolution
		tick();
		expect(snackBarSpy.open).toHaveBeenCalledWith("Password copied to clipboard!", "Close", { duration: 2000 });
		expect(component.copiedFieldId()).toEqual({ id: "acc-1", type: "password" });

		// Reverts after 2 seconds
		tick(2000);
		expect(component.copiedFieldId()).toBeNull();
	}));
});
