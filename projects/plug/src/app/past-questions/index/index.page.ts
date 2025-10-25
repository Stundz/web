import { ViewportScroller } from "@angular/common";
import { httpResource } from "@angular/common/http";
import {
	Component,
	DestroyRef,
	effect,
	ElementRef,
	inject,
	input,
	viewChild,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTab, MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, RouterLink } from "@angular/router";
import {
	combineLatest,
	debounceTime,
	distinctUntilChanged,
	map,
	mergeWith,
	startWith,
	tap,
} from "rxjs";
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
	providers: [PastQuestion],
})
export class IndexPage {
	user = input.required<Model.User>();
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

	pastQuestions = this._pastQuestionService.pastQuestions;
	myContributedPastQuestions = this._pastQuestionService.myPastQuestions;

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

		effect(() => {
			if (this.user()) {
				this._pastQuestionService.publisher.set(this.user()?.id);
			}
		});
	}
}
