import { ScrollingModule } from "@angular/cdk/scrolling";
import { DatePipe, DecimalPipe } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	input,
	linkedSignal,
	signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { debounce, FormField, form } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {
	MatPaginatorModule,
	type PageEvent,
} from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, Params, Router, RouterLink } from "@angular/router";
import { differenceInSeconds } from "date-fns";
import { distinctUntilChanged, startWith, switchMap } from "rxjs";
import {
	type Model,
	type Paginated,
	PremiflyService,
	PremiflyServiceLogo,
} from "shared";

@Component({
	selector: "admin-show",
	imports: [
		DatePipe,
		DecimalPipe,
		RouterLink,
		FormField,
		MatCardModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatInputModule,
		MatTableModule,
		MatPaginatorModule,
		MatRadioModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		ScrollingModule,
		PremiflyServiceLogo,
	],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowPage {
	#service = inject(PremiflyService);
	#router = inject(Router);
	#route = inject(ActivatedRoute);

	service = input.required<Model.Premifly.Service>();

	// Route QueryParams Stream mapped safely to a signal
	#queryParams = toSignal(this.#route.queryParams, { initialValue: {} as Params });

subscribers = toSignal(
  this.#route.queryParams.pipe(
    // 1. Prevent duplicate emissions if the route parameters haven't actually changed
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    switchMap((params) =>
      this.#service
        .getSubscribers(this.#route.snapshot.params["service"], params)
        .pipe(
          // Keep this startWith to provide your empty/loading structural metadata safely
          startWith({
            data: [],
            meta: {
              total: 0,
              from: 0,
              to: 0,
              current_page: 1,
              per_page: 15,
            },
            links: [],
          } as Paginated<
            Model.User & { premifly_accounts: Array<Model.Premifly.Account> }
          >),
        ),
    ),
  ),
  {
    requireSync: true,
  },
);

	pageSizes = linkedSignal(() => [
		...new Set([5, 10, 15, 20, this.subscribers()?.meta?.per_page || 15]),
	]);

	isFiltersExpanded = signal(false);

	// Automatically derives underlying form values from route params safely
	formState = linkedSignal(() => {
		const params = this.#queryParams();

		return {
			q: params["q"] || "",
			status: params["status"] || "",
			period: params["period"] || "",
			page: Number(params["page"]) || 1,
			limit: params["limit"] || null,
		};
	});

	form = form(
		this.formState,
		(root) => {
			debounce(root.q, 600);
		},
		{},
	);

	// Single source of truth effect handling sync back to the URL parameters
	formNavigationEffect = effect(() => {
		const rawValues = this.form().value();

		const queryParams = Object.fromEntries(
			Object.entries(rawValues).filter(([key, value]) => {
				if (key === "page" && Number(value) > 1) return true;
				if (key !== "page" && Boolean(value)) return true;
				return false;
			})
		);

		// Resolve current URL structure to avoid navigating if the route mirrors current values
		const currentParams = this.#queryParams();
		const hasChanged = JSON.stringify(queryParams) !== JSON.stringify(currentParams);

		if (hasChanged) {
			this.#router.navigate([], {
				queryParams,
				// Optional: use 'replaceUrl: true' if you want typing inside `q` not to flood browser back history stack
				replaceUrl: true,
			});
		}
	});

	handlePaginatorEvent(event: PageEvent) {
		this.form().value.update((value) => {
			value["page"] = event.pageIndex + 1;

			if (
				this.subscribers()?.meta?.per_page &&
				this.subscribers()?.meta.per_page !== event.pageSize
			) {
				value["limit"] = String(event.pageSize);
			} else {
				value["limit"] = null;
			}

			return value;
		});
	}

	isActiveSubscription(date?: string) {
		return date === undefined ? false : differenceInSeconds(date, Date.now()) > 0;
	}

	getInitials(firstName?: string, lastName?: string): string {
		const f = firstName?.trim().charAt(0) || "";
		const l = lastName?.trim().charAt(0) || "";
		return (f + l).toUpperCase() || "S";
	}

	getAvatarColor(firstName?: string, lastName?: string): string {
		const name = `${firstName || ""} ${lastName || ""}`.trim();
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		const colors = [
			"bg-indigo-500/10 text-indigo-500 border-indigo-200/50 dark:border-indigo-900/30",
			"bg-teal-500/10 text-teal-500 border-teal-200/50 dark:border-teal-900/30",
			"bg-rose-500/10 text-rose-500 border-rose-200/50 dark:border-rose-900/30",
			"bg-amber-500/10 text-amber-500 border-amber-200/50 dark:border-amber-900/30",
			"bg-sky-500/10 text-sky-500 border-sky-200/50 dark:border-sky-900/30",
			"bg-emerald-500/10 text-emerald-500 border-emerald-200/50 dark:border-emerald-900/30",
		];
		const index = Math.abs(hash) % colors.length;
		return colors[index];
	}

	toggleFilters() {
		this.isFiltersExpanded.update((v) => !v);
	}
}
