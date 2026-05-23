import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { of } from "rxjs";
import { PremiflyService } from "shared";
import { IndexPage } from "./index.page";

describe("IndexPage", () => {
	let component: IndexPage;
	let fixture: ComponentFixture<IndexPage>;

	const mockPremiflyService = {
		delete: () => of({}),
	};

	const mockRouter = {
		navigate: () => Promise.resolve(true),
	};

	const mockActivatedRoute = {
		snapshot: {
			queryParams: {},
		},
	};

	const mockSnackBar = {
		open: () => {},
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IndexPage],
			providers: [
				{ provide: PremiflyService, useValue: mockPremiflyService },
				{ provide: Router, useValue: mockRouter },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
				{ provide: MatSnackBar, useValue: mockSnackBar },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexPage);
		component = fixture.componentInstance;

		// Set required signal input before starting change detection
		fixture.componentRef.setInput("services", {
			data: [
				{
					id: "1",
					name: "Netflix Premium",
					slug: "netflix-premium",
					price: 5000,
					enabled: true,
					limit: 4,
					created_at: "2026-05-22T04:00:00Z",
					updated_at: "2026-05-22T04:00:00Z",
				},
				{
					id: "2",
					name: "Spotify Premium",
					slug: "spotify-premium",
					price: 2500,
					enabled: false,
					limit: null,
					created_at: "2026-05-22T04:00:00Z",
					updated_at: "2026-05-22T04:00:00Z",
				},
			],
			meta: {
				total: 2,
				per_page: 15,
				current_page: 1,
				from: 1,
				to: 2,
			},
			links: {},
		});

		await fixture.whenStable();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
