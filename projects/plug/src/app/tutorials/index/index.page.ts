import { NgOptimizedImage } from "@angular/common";
import { Component, effect, inject, input, signal, ChangeDetectionStrategy } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule } from "@angular/forms";
import { debounce, FormField, form } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatExpansionPanel } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {
	MatPaginatorModule,
	type PageEvent,
} from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { tap } from "rxjs";
import type { Model, Paginated } from "shared";
import { TutorialCard } from "../../common/components/tutorial-card/tutorial-card";
import { Tutorial } from "../../common/services/tutorial";

@Component({
	selector: "plug-tutorials-index",
	imports: [
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatTableModule,
		RouterLink,
		MatButtonModule,
		ReactiveFormsModule,
		MatExpansionPanel,
		MatPaginatorModule,
		MatCardModule,
		MatSelectModule,
		NgOptimizedImage,
		TutorialCard,
		MatChipsModule,
		FormField,
	],
	templateUrl: "./index.page.ng.html",
	styleUrl: "./index.page.scss",
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {
		ngSkipHydration: "true",
	},
})
export class IndexPage {
	user = input.required<Model.User>();
	#tutorialService = inject(Tutorial);
	#route = inject(ActivatedRoute);
	tutorials = toSignal(this.#tutorialService.tutorials$, { requireSync: true });
	#router = inject(Router);
	#meta = inject(Meta);
	#title = inject(Title);

	filters = signal({
		q: this.#route.snapshot.queryParamMap.get("q") || "",
		filters: {
			page: (this.#route.snapshot.queryParamMap.get("page") || "") as
				| string
				| number,
			limit: this.#route.snapshot.queryParamMap.get("limit") || "",
			day: this.#route.snapshot.queryParamMap.get("day") || "",
			institution: String(
				this.#route.snapshot.queryParamMap.get("institution") || "",
			),
			faculty: (this.#route.snapshot.queryParams["faculty"] as string) || null,
			department:
				(this.#route.snapshot.queryParams["department"] as string) || null,
			course: (this.#route.snapshot.queryParams["course"] as string) || null,
			semester:
				(this.#route.snapshot.queryParams["semester"] as string) || null,
		},
	});
	tutorialFilters = form(this.filters, (root) => {
		debounce(root.q, 800);
	});

	queryEffect = effect(() => {
		this.#router.navigate(["."], {
			relativeTo: this.#route,
			replaceUrl: true,
			queryParams: Object.fromEntries(
				Object.entries({
					q: this.tutorialFilters.q().value(),
					page: 1,
				}).filter(([_, value]) => Boolean(value)),
			),
			queryParamsHandling: "replace",
		});
		console.log("Query changed");
	});

	paramsEffect = effect(() => {
		this.#router.navigate(["."], {
			relativeTo: this.#route,
			replaceUrl: true,
			queryParams: Object.fromEntries(
				Object.entries({
					q: this.tutorialFilters.q().value(),
					...this.tutorialFilters.filters().value(),
				}).filter(([_, value]) => Boolean(value)),
			),
			queryParamsHandling: "replace",
		});
	});

	constructor() {
		this.#route.queryParams
			.pipe(
				takeUntilDestroyed(),
				tap((params) => this.#tutorialService.filters.next(params)),
			)
			.subscribe();

		this.#meta.updateTag({
			id: "description",
			name: "description",
			content:
				"Search and filter through a wide range of tutorials to find the perfect tutor for you.",
		});
		this.#meta.updateTag({
			id: "og:title",
			property: "og:title",
			content: this.#title.getTitle(),
		});
		this.#meta.updateTag({
			id: "og:description",
			property: "og:description",
			content:
				"Search and filter through a wide range of tutorials to find the perfect tutor for you",
		});
		this.#meta.updateTag({
			id: "keywords",
			name: "keywords",
			content:
				"plug, stundz, study, tutorials, tutor, past questions, revision, education",
		});
	}

	handlePaginatorEvent(event: PageEvent) {
		this.tutorialFilters.filters.page().value.set(event.pageIndex + 1);
	}
}
