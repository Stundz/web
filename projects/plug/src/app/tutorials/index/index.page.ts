import { Component, inject, input } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionPanel } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { debounceTime, distinctUntilChanged, map, mergeWith, tap } from "rxjs";
import { Tutorial } from "../../common/services/tutorial";
import { Model } from "shared";

@Component({
	selector: "app-index",
	imports: [
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
	private _route = inject(ActivatedRoute);
	private _router = inject(Router);
	tutorials = toSignal(this._tutorialService.tutorials$.pipe(), {
		requireSync: true,
	});

	form = this.#fb.group({
		q: this.#fb.control<string>(this._route.snapshot.queryParams["q"] ?? ""),
		filters: this.#fb.group({
			page: this.#fb.control<number>(0),
			limit: this.#fb.control<number>(0),
			institution: this.#fb.control<string>(
				this._route.snapshot.queryParams["institution"],
			),
			faculty: this.#fb.control(""),
			department: this.#fb.control(""),
			semester: this.#fb.control<string>(
				this._route.snapshot.queryParams["semester"],
			),
			course: this.#fb.control(this._route.snapshot.queryParams["course"]),
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

	constructor(meta: Meta, title: Title) {
		meta.addTags([
			{
				id: "description",
				name: "description",
				content:
					"Search and filter through a wide range of tutorials to find the perfect tutor for you.",
			},
			{
				id: "og:title",
				property: "og:title",
				content: title.getTitle(),
			},
			{
				id: "og:description",
				property: "og:description",
				content:
					"Search and filter through a wide range of tutorials to find the perfect tutor for you",
			},
			{
				id: "keywords",
				name: "keywords",
				content:
					"plug, stundz, study, tutorials, tutor, past questions, revision, education",
			},
			{
				id: "og:image",
				property: "og:image",
				content:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
			},
			{
				id: "og:image.url",
				property: "og:image",
				content:
					"http://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
			},
			{
				id: "og:image.secure_url",
				property: "og:image",
				content:
					"http://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
			},
		]);
	}
}
