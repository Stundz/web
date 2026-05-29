import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { CreatePage } from "./create.page";
import { PremiflyAccount } from "shared";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

describe("CreatePage", () => {
	let component: CreatePage;
	let fixture: ComponentFixture<CreatePage>;
	let accountServiceSpy: jasmine.SpyObj<PremiflyAccount>;
	let routerSpy: jasmine.SpyObj<Router>;
	let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

	beforeEach(async () => {
		accountServiceSpy = jasmine.createSpyObj("PremiflyAccount", ["create"]);
		routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
		snackBarSpy = jasmine.createSpyObj("MatSnackBar", ["open"]);

		await TestBed.configureTestingModule({
			imports: [CreatePage, NoopAnimationsModule],
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

		fixture = TestBed.createComponent(CreatePage);
		component = fixture.componentInstance;
		fixture.detectChanges();
		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should initialize form with empty values and invalid state", () => {
		expect(component.form.email().value()).toBe("");
		expect(component.form.password().value()).toBe("");
		expect(component.form.code().value()).toBe("");
		expect(component.form.expires_at().value()).toBe("");
		expect(component.form().invalid()).toBeTrue();
	});

	it("should validate email field (required and valid email format)", () => {
		// Required check
		component.form.email().value.set("");
		fixture.detectChanges();
		expect(component.form.email().errors()).toBeDefined();

		// Invalid format
		component.form.email().value.set("invalid-email");
		fixture.detectChanges();
		const errors = component.form.email().errors();
		expect(errors).toBeDefined();
		expect(errors?.[0]?.message).toBe("Please enter a valid email address");

		// Valid format
		component.form.email().value.set("test@example.com");
		fixture.detectChanges();
		expect(component.form.email().errors()).toBeUndefined();
	});

	it("should validate password field (required and minLength 6)", () => {
		// Required check
		component.form.password().value.set("");
		fixture.detectChanges();
		expect(component.form.password().errors()).toBeDefined();

		// Min length 6
		component.form.password().value.set("12345");
		fixture.detectChanges();
		const errors = component.form.password().errors();
		expect(errors).toBeDefined();
		expect(errors?.[0]?.message).toBe("Password must be at least 6 characters long");

		// Valid format
		component.form.password().value.set("123456");
		fixture.detectChanges();
		expect(component.form.password().errors()).toBeUndefined();
	});

	it("should validate code field (required and minLength 3)", () => {
		// Required check
		component.form.code().value.set("");
		fixture.detectChanges();
		expect(component.form.code().errors()).toBeDefined();

		// Min length 3
		component.form.code().value.set("ab");
		fixture.detectChanges();
		const errors = component.form.code().errors();
		expect(errors).toBeDefined();
		expect(errors?.[0]?.message).toBe("Code must be at least 3 characters long");

		// Valid format
		component.form.code().value.set("abc");
		fixture.detectChanges();
		expect(component.form.code().errors()).toBeUndefined();
	});

	it("should become valid when all fields are correct", () => {
		component.form.email().value.set("test@example.com");
		component.form.password().value.set("password123");
		component.form.code().value.set("CODE123");
		fixture.detectChanges();
		expect(component.form().invalid()).toBeFalse();
	});

	it("should successfully call create API and navigate back on submit", fakeAsync(() => {
		component.form.email().value.set("test@example.com");
		component.form.password().value.set("password123");
		component.form.code().value.set("CODE123");
		component.form.expires_at().value.set("2026-12-31T23:59");
		fixture.detectChanges();

		const mockResponse = {
			id: "acc-new",
			email: "test@example.com",
			password: "password123",
			code: "CODE123",
			expires_at: "2026-12-31T23:59:00.000Z",
			subscriptions_count: 0,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		accountServiceSpy.create.and.returnValue(of(mockResponse));

		// Call the action directly or trigger submit
		component.form().submit();
		tick();

		expect(accountServiceSpy.create).toHaveBeenCalledWith({
			email: "test@example.com",
			password: "password123",
			code: "CODE123",
			expires_at: new Date("2026-12-31T23:59").toISOString(),
		});

		expect(snackBarSpy.open).toHaveBeenCalledWith(
			`Account "test@example.com" created successfully!`,
			"Close",
			jasmine.any(Object),
		);
		expect(routerSpy.navigate).toHaveBeenCalledWith([".."], jasmine.any(Object));
	}));

	it("should show snackbar message on API error", fakeAsync(() => {
		component.form.email().value.set("test@example.com");
		component.form.password().value.set("password123");
		component.form.code().value.set("CODE123");
		fixture.detectChanges();

		const errorResponse = new HttpErrorResponse({
			error: { message: "Email already exists" },
			status: 422,
		});
		accountServiceSpy.create.and.returnValue(throwError(() => errorResponse));

		component.form().submit();
		tick();

		expect(snackBarSpy.open).toHaveBeenCalledWith(
			"Email already exists",
			"Close",
			jasmine.any(Object),
		);
	}));
});
