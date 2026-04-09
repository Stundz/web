import { NgOptimizedImage } from "@angular/common";
import { Component, effect, inject, input, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { debounce, FormField, form } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import {
	type MatChipListboxChange,
	MatChipsModule,
} from "@angular/material/chips";
import { MatExpansionPanel } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { debounceTime, distinctUntilChanged, map, mergeWith, tap } from "rxjs";
import type { Model } from "shared";
import { TutorialCard } from "../../common/components/tutorial-card/tutorial-card";
import { Tutorial } from "../../common/services/tutorial";

@Component({
	selector: "app-index",
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
	host: {
		ngSkipHydration: "true",
	},
})
export class IndexPage {
	user = input.required<Model.User>();
	private _tutorialService = inject(Tutorial);
	#fb = inject(NonNullableFormBuilder);
	#route = inject(ActivatedRoute);
	private _router = inject(Router);
	tutorials = toSignal(this._tutorialService.tutorials$.pipe(), {
		requireSync: true,
	});
	#meta = inject(Meta);
	#title = inject(Title);

	filters = signal({
		query: this.#route.snapshot.queryParams["q"] as string,
		filters: {
			page: 0,
			limit: 0,
			institution: this.#route.snapshot.queryParams["institution"] as string,
			faculty: this.#route.snapshot.queryParams["faculty"] as string,
			department: this.#route.snapshot.queryParams["department"] as string,
			course: this.#route.snapshot.queryParams["course"] as string,
			semester: this.#route.snapshot.queryParams["semester"] as string,
		},
	});
	tutorialFilters = form(this.filters, (root) => {
		debounce(root.query, 600);
	});

	form = this.#fb.group({
		q: this.#fb.control<string>(this.#route.snapshot.queryParams["q"] ?? ""),
		filters: this.#fb.group({
			page: this.#fb.control<number>(0),
			limit: this.#fb.control<number>(0),
			day: this.#fb.control<string>(
				this.#route.snapshot.queryParams["day"] ?? "",
			),
			institution: this.#fb.control<string>(
				this.#route.snapshot.queryParams["institution"],
			),
			faculty: this.#fb.control(""),
			department: this.#fb.control(""),
			semester: this.#fb.control<string>(
				this.#route.snapshot.queryParams["semester"],
			),
			course: this.#fb.control(this.#route.snapshot.queryParams["course"]),
		}),
	});

	params = toSignal(
		this.form.controls.q.valueChanges
			.pipe(
				debounceTime(600),
				distinctUntilChanged(),
				tap(() =>
					this.form.controls.filters.patchValue(
						{ page: 1 },
						{ emitEvent: false },
					),
				),
				map((value) => value.trim()),
				mergeWith(
					this.form.controls.filters.valueChanges.pipe(
						map((filters) => filters),
					),
				),
			)
			.pipe(
				map(() => {
					const data = {
						q: this.form.controls.q.value,
						...this.form.controls.filters.value,
					};

					return Object.fromEntries(
						Object.entries(data).filter(([key, value]) =>
							key === "page" && value == 1 ? false : Boolean(value),
						),
					);
				}),
				tap((queryParams) => {
					this._tutorialService.filters.next(queryParams);
				}),
			),
	);

	constructor() {
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
		this.#meta.updateTag({
			id: "og:image",
			property: "og:image",
			content:
				"https://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
		});
		this.#meta.updateTag({
			id: "og:image.url",
			property: "og:image",
			content:
				"http://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
		});
		this.#meta.updateTag({
			id: "og:image.secure_url",
			property: "og:image",
			content:
				"http://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
		});

		effect(() => {
			if (this.tutorialFilters.query().touched()) {
				console.log("querying");
			}
		});
	}

	handleDaySelection(event: MatChipListboxChange) {
		this.form
			.get("filters")
			?.get("day")
			?.setValue(event.value.toLowerCase() === "all" ? "" : event.value);
	}
}
