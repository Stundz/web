import { NgOptimizedImage } from "@angular/common";
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
	PremiflyAccount,
	PremiflyServiceLogo,
} from "shared";

@Component({
	selector: "admin-index",
	imports: [
		RouterLink,
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
	#accountService = inject(PremiflyAccount);
	#snackBar = inject(MatSnackBar);

	accounts = input.required<Paginated<Model.Premifly.Account>>();

	// Derived state for total subscriptions sum across all listed accounts
	totalSubscriptions = computed(() => {
		const data = this.accounts().data;
		return data
			? data.reduce((sum, acc) => sum + (acc.subscriptions_count || 0), 0)
			: 0;
	});

	// Track which account ID is currently waiting for delete confirmation
	confirmDeleteId = signal<string | null>(null);
	#resetTimeout: any = null;

	// Track which account and field has been copied recently to show a success checkmark
	copiedFieldId = signal<{ id: string; type: "password" | "code" } | null>(
		null,
	);
	#copyTimeout: any = null;

	copyToClipboard(
		text: string,
		label: string,
		accountId: string,
		type: "password" | "code",
		event: Event,
	) {
		event.stopPropagation(); // Avoid row click navigation
		if (!text) return;

		navigator.clipboard.writeText(text).then(
			() => {
				this.#snackBar.open(`${label} copied to clipboard!`, "Close", {
					duration: 2000,
				});
				this.copiedFieldId.set({ id: accountId, type });

				if (this.#copyTimeout) {
					clearTimeout(this.#copyTimeout);
				}
				this.#copyTimeout = setTimeout(() => {
					this.copiedFieldId.set(null);
				}, 2000);
			},
			() => {
				this.#snackBar.open(`Failed to copy ${label.toLowerCase()}.`, "Close", {
					duration: 2000,
				});
			},
		);
	}

	handlePaginatorEvent(event: PageEvent) {
		const queryParams: Params = { page: event.pageIndex + 1 };

		if (this.accounts().meta.per_page !== event.pageSize) {
			queryParams["limit"] = event.pageSize;
		}

		this.#router.navigate([], {
			queryParams,
		});
	}

	editAccount(account: Model.Premifly.Account, event: Event) {
		event.stopPropagation(); // Avoid triggering row-click navigation
		this.#router.navigate(["..", "account", account.id, "edit"], {
			relativeTo: this.#route,
		});
	}

	deleteAccount(account: Model.Premifly.Account, event: Event) {
		event.stopPropagation(); // Avoid triggering row-click navigation

		if (this.confirmDeleteId() === account.id) {
			// Second click: trigger actual delete API
			this.confirmDeleteId.set(null);
			if (this.#resetTimeout) {
				clearTimeout(this.#resetTimeout);
			}

			firstValueFrom(
				this.#accountService.delete(account.id).pipe(
					tap({
						next: () => {
							this.#snackBar.open(
								`Account "${account.email}" was successfully deleted!`,
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
								"Failed to delete account. Please try again.",
							"Close",
							{ duration: 4000 },
						);
						return of(null);
					}),
				),
			);
		} else {
			// First click: activate inline double-confirmation state
			this.confirmDeleteId.set(account.id);
			if (this.#resetTimeout) {
				clearTimeout(this.#resetTimeout);
			}
			this.#resetTimeout = setTimeout(() => {
				if (this.confirmDeleteId() === account.id) {
					this.confirmDeleteId.set(null);
				}
			}, 4000); // Auto-revert if they do not confirm within 4 seconds
		}
	}
}
