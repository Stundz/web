import { ViewportScroller } from "@angular/common";
import { Component, DestroyRef, inject, input, viewChild } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTab, MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { debounceTime, distinctUntilChanged, map, mergeWith, tap } from "rxjs";
import { Model, Paginated, User } from "shared";
import { PastQuestion } from "../../common/services/past-question";

@Component({
	selector: "app-index",
	imports: [
		RouterLink,
		ReactiveFormsModule,
		MatPaginatorModule,
		MatTabsModule,
		MatButtonModule,
		MatExpansionModule,
	],
	templateUrl: "./index.page.ng.html",
	styleUrl: "./index.page.scss",
})
export class IndexPage {
	user = input.required<Model.User>();
	pastQuestions = input.required<Paginated<Model.Plug.PastQuestion>>();

	private _fb = inject(FormBuilder);
	private _route = inject(ActivatedRoute);
	private _pastQuestionService = inject(PastQuestion);
	private _destroyRef = inject(DestroyRef);
	viewPortScroller = inject(ViewportScroller);
	myContributionTab = viewChild<MatTab>("myContributions");

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

	myContributedPastQuestions = toSignal(
		this._pastQuestionService.myPastQuestions$,
		{
			initialValue: {
				data: [],
				meta: {
					total: 0,
					current_page: 0,
					per_page: 0,
					from: 0,
					to: 0,
				},
				links: {},
			},
		},
	);

	constructor() {
		this.form.controls.q.valueChanges
			.pipe(
				takeUntilDestroyed(this._destroyRef),
				debounceTime(600),
				distinctUntilChanged(),
				map((q) => q.trim()),
				tap((q) =>
					this._pastQuestionService.filters.update((value) => ({
						...value,
						page: 1,
						q,
					})),
				),
				mergeWith(
					this.form.controls.filters.valueChanges.pipe(
						map((filters) =>
							this._pastQuestionService.filters.update((value) => ({
								...value,
								...filters,
							})),
						),
					),
				),
			)
			.subscribe();
	}

	getMyContributions() {
		console.log("hello");
		if (this.user()) {
			this._pastQuestionService.publisher.set(this.user()?.id);
		}
	}
}
