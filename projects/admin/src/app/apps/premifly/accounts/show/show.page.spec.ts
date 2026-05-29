import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ShowPage } from "./show.page";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { type Model } from "shared";

describe("ShowPage", () => {
	let component: ShowPage;
	let fixture: ComponentFixture<ShowPage>;
	let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

	const mockAccount: Model.Premifly.Account = {
		id: "acc-1",
		email: "test@example.com",
		password: "secretpassword123",
		code: "TOKEN-300",
		expires_at: "2026-12-31T23:59:59.000Z",
		subscriptions_count: 5,
		created_at: "2026-05-22T10:00:00.000Z",
		updated_at: "2026-05-22T10:00:00.000Z",
	};

	beforeEach(async () => {
		snackBarSpy = jasmine.createSpyObj("MatSnackBar", ["open"]);

		await TestBed.configureTestingModule({
			imports: [ShowPage, NoopAnimationsModule],
			providers: [
				{ provide: MatSnackBar, useValue: snackBarSpy },
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: { queryParams: {} },
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ShowPage);
		component = fixture.componentInstance;

		// Inject the required signal input
		fixture.componentRef.setInput("account", mockAccount);

		fixture.detectChanges();
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should show default values and display components", () => {
		expect(component.account()).toEqual(mockAccount);
		expect(component.copiedField()).toBeNull();
	});

	it("should copy password to clipboard and set copiedField signal with a 2-second timeout", fakeAsync(() => {
		const spyClipboard = spyOn(navigator.clipboard, "writeText").and.returnValue(Promise.resolve());

		component.copyToClipboard("secretpassword123", "Password", "password");

		expect(spyClipboard).toHaveBeenCalledWith("secretpassword123");

		tick(); // Resolve the promise
		expect(snackBarSpy.open).toHaveBeenCalledWith("Password copied to clipboard!", "Close", { duration: 2000 });
		expect(component.copiedField()).toBe("password");

		// Reverts after 2 seconds
		tick(2000);
		expect(component.copiedField()).toBeNull();
	}));

	it("should copy code to clipboard and set copiedField signal with a 2-second timeout", fakeAsync(() => {
		const spyClipboard = spyOn(navigator.clipboard, "writeText").and.returnValue(Promise.resolve());

		component.copyToClipboard("TOKEN-300", "Account Code", "code");

		expect(spyClipboard).toHaveBeenCalledWith("TOKEN-300");

		tick(); // Resolve the promise
		expect(snackBarSpy.open).toHaveBeenCalledWith("Account Code copied to clipboard!", "Close", { duration: 2000 });
		expect(component.copiedField()).toBe("code");

		// Reverts after 2 seconds
		tick(2000);
		expect(component.copiedField()).toBeNull();
	}));

	it("should show error snackbar on clipboard write failure", fakeAsync(() => {
		spyOn(navigator.clipboard, "writeText").and.returnValue(Promise.reject("error"));

		component.copyToClipboard("TOKEN-300", "Account Code", "code");

		tick(); // Resolve the promise rejection
		expect(snackBarSpy.open).toHaveBeenCalledWith("Failed to copy account code.", "Close", { duration: 2000 });
		expect(component.copiedField()).toBeNull();
	}));
});
