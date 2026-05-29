import { DecimalPipe, NgOptimizedImage } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	signal,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {
	MatPaginatorModule,
	type PageEvent,
} from "@angular/material/paginator";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
	ActivatedRoute,
	type Params,
	Router,
	RouterLink,
} from "@angular/router";
import { catchError, firstValueFrom, of, tap } from "rxjs";
import {
	type Model,
	type Paginated,
	PremiflyService,
	PremiflyServiceLogo,
} from "shared";

@Component({
	selector: "admin-index",
	imports: [
		RouterLink,
		DecimalPipe,
		NgOptimizedImage,
		MatTableModule,
		MatPaginatorModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatSnackBarModule,
		PremiflyServiceLogo,
	],
	templateUrl: "./index.page.ng.html",
	styleUrl: "./index.page.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPage {
	#router = inject(Router);
	#route = inject(ActivatedRoute);
	#service = inject(PremiflyService);
	#snackBar = inject(MatSnackBar);

	services = input.required<Paginated<Model.Premifly.Service>>();

	// Derived state for active tiers count
	activeCount = computed(() => {
		const data = this.services().data;
		return data ? data.filter((s) => s.enabled).length : 0;
	});

	// Track which service ID is currently waiting for delete confirmation
	confirmDeleteId = signal<string | null>(null);
	#resetTimeout: any = null;

	handlePaginatorEvent(event: PageEvent) {
		const queryParams: Params = { page: event.pageIndex + 1 };

		if (this.services().meta.per_page !== event.pageSize) {
			queryParams["limit"] = event.pageSize;
		}

		this.#router.navigate([], {
			queryParams,
		});
	}

	editService(service: Model.Premifly.Service, event: Event) {
		event.stopPropagation(); // Avoid triggering row-click navigation
		this.#router.navigate(["..", "service", service.id, "edit"], {
			relativeTo: this.#route,
		});
	}

	deleteService(service: Model.Premifly.Service, event: Event) {
		event.stopPropagation(); // Avoid triggering row-click navigation

		if (this.confirmDeleteId() === service.id) {
			// Second click: trigger actual delete API
			this.confirmDeleteId.set(null);
			if (this.#resetTimeout) {
				clearTimeout(this.#resetTimeout);
			}

			firstValueFrom(
				this.#service.delete(service.id).pipe(
					tap({
						next: () => {
							this.#snackBar.open(
								`Service "${service.name}" was successfully deleted!`,
								"Close",
								{ duration: 3000 },
							);
							// Refresh route resolved data list by re-triggering the resolver
							this.#router.navigate([], {
								queryParams: {
									...this.#route.snapshot.queryParams,
									_t: Date.now(),
								},
								queryParamsHandling: "merge",
							});
						},
					}),
					catchError((error) => {
						this.#snackBar.open(
							error?.error?.message ||
								"Failed to delete service. Please try again.",
							"Close",
							{ duration: 4000 },
						);
						return of(null);
					}),
				),
			);
		} else {
			// First click: activate inline double-confirmation state
			this.confirmDeleteId.set(service.id);
			if (this.#resetTimeout) {
				clearTimeout(this.#resetTimeout);
			}
			this.#resetTimeout = setTimeout(() => {
				if (this.confirmDeleteId() === service.id) {
					this.confirmDeleteId.set(null);
				}
			}, 4000); // Auto-revert if they do not confirm within 4 seconds
		}
	}
}
