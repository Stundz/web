import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { of } from "rxjs";
import { PremiflyService } from "shared";
import { EditPage } from "./edit.page";

describe("EditPage", () => {
	let component: EditPage;
	let fixture: ComponentFixture<EditPage>;

	const mockPremiflyService = {
		update: () => of({}),
	};

	const mockRouter = {
		navigate: () => Promise.resolve(true),
	};

	const mockActivatedRoute = {
		snapshot: {
			params: { service: "123" },
		},
	};

	const mockSnackBar = {
		open: () => {},
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EditPage],
			providers: [
				{ provide: PremiflyService, useValue: mockPremiflyService },
				{ provide: Router, useValue: mockRouter },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
				{ provide: MatSnackBar, useValue: mockSnackBar },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(EditPage);
		component = fixture.componentInstance;

		// Set required signal input before starting change detection
		fixture.componentRef.setInput("service", {
			id: "123",
			name: "Netflix Premium",
			slug: "netflix-premium",
			price: 5000,
			enabled: true,
			limit: 4,
			created_at: "2026-05-22T04:00:00Z",
			updated_at: "2026-05-22T04:00:00Z",
		});

		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
