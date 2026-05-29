import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { EditPage } from "./edit.page";
import { PremiflyAccount, type Model } from "shared";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

describe("EditPage", () => {
	let component: EditPage;
	let fixture: ComponentFixture<EditPage>;
	let accountServiceSpy: jasmine.SpyObj<PremiflyAccount>;
	let routerSpy: jasmine.SpyObj<Router>;
	let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

	const mockAccount: Model.Premifly.Account = {
		id: "acc-1",
		email: "existing@example.com",
		password: "existingpassword",
		code: "EX-100",
		expires_at: "2026-12-31T23:59:59.000Z", // UTC
		subscriptions_count: 3,
		created_at: "2026-05-22T10:00:00.000Z",
		updated_at: "2026-05-22T10:00:00.000Z",
	};

	beforeEach(async () => {
		accountServiceSpy = jasmine.createSpyObj("PremiflyAccount", ["update"]);
		routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
		snackBarSpy = jasmine.createSpyObj("MatSnackBar", ["open"]);

		await TestBed.configureTestingModule({
			imports: [EditPage, NoopAnimationsModule],
			providers: [
				{ provide: PremiflyAccount, useValue: accountServiceSpy },
				{ provide: Router, useValue: routerSpy },
				{ provide: MatSnackBar, useValue: snackBarSpy },
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: { queryParams: {} },
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(EditPage);
		component = fixture.componentInstance;

		// Inject the required signal input
		fixture.componentRef.setInput("account", mockAccount);

		fixture.detectChanges();
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should populate the formState with formatted fields on init", () => {
		expect(component.form.email().value()).toBe("existing@example.com");
		expect(component.form.password().value()).toBe("existingpassword");
		expect(component.form.code().value()).toBe("EX-100");

		// Expiry date verification with timezone offset applied
		const dateObj = new Date("2026-12-31T23:59:59.000Z");
		const offset = dateObj.getTimezoneOffset();
		const localDate = new Date(dateObj.getTime() - offset * 60 * 1000);
		const expectedExpiresStr = localDate.toISOString().substring(0, 16);

		expect(component.form.expires_at().value()).toBe(expectedExpiresStr);
		expect(component.form().invalid()).toBeFalse();
	});

	it("should validate and show errors on fields", () => {
		// Empty email should be invalid
		component.form.email().value.set("");
		fixture.detectChanges();
		expect(component.form.email().errors()).toBeDefined();

		// Set valid email back
		component.form.email().value.set("new@example.com");
		fixture.detectChanges();
		expect(component.form.email().errors()).toBeUndefined();

		// Check minLength on password
		component.form.password().value.set("123");
		fixture.detectChanges();
		expect(component.form.password().errors()).toBeDefined();

		// Set valid password back
		component.form.password().value.set("newpassword123");
		fixture.detectChanges();
		expect(component.form.password().errors()).toBeUndefined();
	});

	it("should successfully update and redirect back on submit", fakeAsync(() => {
		// Set updated values
		component.form.email().value.set("updated@example.com");
		component.form.password().value.set("newpassword123");
		component.form.code().value.set("UPDATED-200");
		component.form.expires_at().value.set("2026-06-01T12:00");
		fixture.detectChanges();

		const mockResponse = {
			...mockAccount,
			email: "updated@example.com",
			password: "newpassword123",
			code: "UPDATED-200",
			expires_at: new Date("2026-06-01T12:00").toISOString(),
		};

		accountServiceSpy.update.and.returnValue(of(mockResponse));

		component.form().submit();
		tick();

		expect(accountServiceSpy.update).toHaveBeenCalledWith("acc-1", {
			email: "updated@example.com",
			password: "newpassword123",
			code: "UPDATED-200",
			expires_at: new Date("2026-06-01T12:00").toISOString(),
		});

		expect(snackBarSpy.open).toHaveBeenCalledWith(
			`Account "updated@example.com" updated successfully!`,
			"Close",
			jasmine.any(Object),
		);
		expect(routerSpy.navigate).toHaveBeenCalledWith([".."], jasmine.any(Object));
	}));

	it("should handle expiration as null if left empty", fakeAsync(() => {
		component.form.expires_at().value.set("");
		fixture.detectChanges();

		accountServiceSpy.update.and.returnValue(of(mockAccount));

		component.form().submit();
		tick();

		expect(accountServiceSpy.update).toHaveBeenCalledWith("acc-1", jasmine.objectContaining({
			expires_at: null,
		}));
	}));

	it("should display error on update API failure", fakeAsync(() => {
		const errorResponse = new HttpErrorResponse({
			error: { message: "Internal server error" },
			status: 500,
		});
		accountServiceSpy.update.and.returnValue(throwError(() => errorResponse));

		component.form().submit();
		tick();

		expect(snackBarSpy.open).toHaveBeenCalledWith(
			"Internal server error",
			"Close",
			jasmine.any(Object),
		);
	}));
});
