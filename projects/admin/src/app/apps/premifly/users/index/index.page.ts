import { Component, inject, input, ChangeDetectionStrategy } from "@angular/core";
import {
	MatPaginatorModule,
	type PageEvent,
} from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { type Params, Router, RouterLink } from "@angular/router";
import type { Model, Paginated } from "shared";

@Component({
	selector: "admin-index",
	imports: [RouterLink, MatTableModule, MatPaginatorModule],
	templateUrl: "./index.page.ng.html",
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: "./index.page.css",
})
export class IndexPage {
	#router = inject(Router);
	users = input.required<Paginated<Model.User>>();

	handlePaginatorEvent(event: PageEvent) {
		const queryParams: Params = { page: event.pageIndex + 1 };

		if (this.users().meta.per_page !== event.pageSize) {
			queryParams["limit"] = event.pageSize;
		}

		this.#router.navigate([], {
			queryParams,
		});
	}
}
