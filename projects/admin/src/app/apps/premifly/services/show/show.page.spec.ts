import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";
import { PremiflyService } from "shared";
import { ShowPage } from "./show.page";

describe("ShowPage", () => {
	let component: ShowPage;
	let fixture: ComponentFixture<ShowPage>;

	const mockPremiflyService = {
		getSubscribers: () =>
			of({
				data: [],
				meta: {
					total: 0,
					per_page: 15,
					current_page: 1,
					from: 0,
					to: 0,
				},
				links: {},
			}),
	};

	const mockRouter = {
		navigate: () => Promise.resolve(true),
	};

	const mockActivatedRoute = {
		queryParams: of({}),
		snapshot: {
			params: { service: "123" },
			queryParams: {},
			queryParamMap: {
				get: () => null,
			},
		},
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ShowPage],
			providers: [
				{ provide: PremiflyService, useValue: mockPremiflyService },
				{ provide: Router, useValue: mockRouter },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ShowPage);
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
