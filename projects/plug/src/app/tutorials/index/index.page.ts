import { DatePipe } from "@angular/common";
import { httpResource } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { environment } from "../../../environments/environment";
import type { Model, Paginated } from "shared";
import { MatButtonModule } from "@angular/material/button";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged, tap, map, mergeWith } from "rxjs";
import { MatExpansionPanel } from "@angular/material/expansion";
import { MatPaginatorModule } from "@angular/material/paginator";

@Component({
	selector: "app-index",
	imports: [
		MatTableModule,
		RouterLink,
		MatButtonModule,
		ReactiveFormsModule,
		MatExpansionPanel,
		MatPaginatorModule,
	],
	templateUrl: "./index.page.ng.html",
	styleUrl: "./index.page.scss",
})
export class IndexPage {
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

	tutorials = httpResource<Paginated<Model.Tutorial>>(
		() => ({ url: `${environment.url.api}/plug/tutorials` }),
		{
			defaultValue: {
				data: [],
				links: {},
				meta: {
					current_page: 0,
					from: 0,
					per_page: 0,
					to: 0,
					total: 0,
				},
			},
		},
	);
}
