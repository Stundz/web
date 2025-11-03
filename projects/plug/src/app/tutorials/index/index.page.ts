import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject, input } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionPanel } from "@angular/material/expansion";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { Meta } from "@angular/platform-browser";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { debounceTime, distinctUntilChanged, map, mergeWith, tap } from "rxjs";
import type { Model, Paginated } from "shared";

@Component({
	selector: "app-index",
	imports: [
		MatTableModule,
		RouterLink,
		MatButtonModule,
		ReactiveFormsModule,
		MatExpansionPanel,
		MatPaginatorModule,
		MatCardModule,
		CurrencyPipe,
	],
	templateUrl: "./index.page.ng.html",
	styleUrl: "./index.page.scss",
})
export class IndexPage {
	tutorials = input.required<Paginated<Model.Plug.Tutorial>>();
	private _fb = inject(FormBuilder);
	private _route = inject(ActivatedRoute);

	form = this._fb.group({
		q: this._fb.control<string>(this._route.snapshot.params["q"] ?? "", {
			nonNullable: true,
		}),
		filters: this._fb.group({
			page: this._fb.control<number>(0, { nonNullable: true }),
			limit: this._fb.control<number>(0, { nonNullable: true }),
			institution: this._fb.control<string>("", {
				nonNullable: true,
			}),
			semester: this._fb.control<string>("", { nonNullable: true }),
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
			),
	);

	constructor(meta: Meta) {
		meta.addTags([
			{
				id: "description",
				name: "description",
				content:
					"Search and filter through a wide range of tutorials to find the perfect tutor for you.",
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
