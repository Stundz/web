import { CurrencyPipe, DatePipe } from "@angular/common";
import { httpResource } from "@angular/common/http";
import { Component, input, ChangeDetectionStrategy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { RouterLink, RouterLinkActive } from "@angular/router";
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
    MatTableModule,
  ],
  templateUrl: "./dashboard.page.ng.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./dashboard.page.css",
})
export class DashboardPage {
  user = input.required<Model.User>();

  subscriptions = httpResource<Paginated<Model.Premifly.Subscription>>(() => ({
    url: `${environment.url.api}/premifly/subscriptions`,
    params: {
      u: this.user().id,
    },
  }));

  date = new Date();

  isActiveSubscription(date?: string) {
    if (!date) return false;

    return differenceInDays(date, Date.now()) > 0;
  }
}
