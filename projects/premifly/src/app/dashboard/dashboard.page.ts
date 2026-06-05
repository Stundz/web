import { CurrencyPipe, DatePipe } from "@angular/common";
import { httpResource } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { debounce, form } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import {
  MatPaginatorModule,
  type PageEvent,
} from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import {
  ActivatedRoute,
  type Params,
  RouterLink,
  RouterLinkActive,
} from "@angular/router";
import { differenceInDays } from "date-fns";
import type { Model, Paginated } from "shared";
import { environment } from "../../environments/environment";

@Component({
  selector: "premifly-dashboard",
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    RouterLinkActive,
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: "./dashboard.page.ng.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./dashboard.page.css",
})
export class DashboardPage {
  user = input.required<Model.User>();

  subscriptions = httpResource<Paginated<Model.Premifly.Subscription>>(
    () => ({
      url: `${environment.url.api}/premifly/subscriptions`,
      params: {
        u: this.user().id,
      },
    }),
    {
      defaultValue: {
        data: [] as Array<Model.Premifly.Subscription>,
        meta: {
          total: 0,
          from: 0,
          to: 0,
          current_page: 1,
          per_page: 15,
        },
      } as Paginated<Model.Premifly.Subscription>,
    },
  );

  date = new Date();

  #route = inject(ActivatedRoute);
  #queryParams = toSignal(this.#route.queryParams, {
    initialValue: {} as Params,
  });
  stats = httpResource(() => ({
    url: `${environment.url.api}/premifly/stats`,
  }));
  formState = linkedSignal(() => {
    const params = this.#queryParams();

    return {
      q: params["q"] || "",
      status: params["status"] || "",
      period: params["period"] || "",
      page: Number(params["page"]) || 1,
      limit: params["limit"] || null,
    };
  });

  form = form(
    this.formState,
    (root) => {
      debounce(root.q, 600);
    },
    {},
  );

  pageSizes = linkedSignal(() => [
    ...new Set([
      5,
      10,
      15,
      20,
      this.subscriptions.value()?.meta?.per_page || 15,
    ]),
  ]);

  isActiveSubscription(date?: string) {
    if (!date) return false;

    return differenceInDays(date, Date.now()) > 0;
  }

  handlePaginatorEvent(event: PageEvent) {
    this.form().value.update((value) => {
      value["page"] = event.pageIndex + 1;

      if (
        this.subscriptions.value()?.meta?.per_page &&
        this.subscriptions.value()?.meta.per_page !== event.pageSize
      ) {
        value["limit"] = String(event.pageSize);
      } else {
        value["limit"] = null;
      }

      return value;
    });
  }
}
