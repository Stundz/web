import { DecimalPipe, PercentPipe } from "@angular/common";
import { httpResource } from "@angular/common/http";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { RouterLink } from "@angular/router";
import { environment } from "../../../environments/environment";

@Component({
  selector: "admin-premifly",
  imports: [
    DecimalPipe,
    PercentPipe,
    RouterLink,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: "./premifly.page.ng.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./premifly.page.css",
})
export class PremiflyPage {
  stats = httpResource<{
    users: Record<"total" | "last_week" | "this_week", number>;
    accounts: Record<"total" | "last_week" | "this_week", number>;
    services: Record<"total" | "last_week" | "this_week", number>;
    subscriptions: Record<"total" | "last_week" | "this_week", number>;
  }>(() => `${environment.url.api}/a/premifly/stats`, {
    defaultValue: {
      users: {
        last_week: 0,
        this_week: 0,
        total: 0,
      },
      accounts: {
        last_week: 0,
        this_week: 0,
        total: 0,
      },
      subscriptions: {
        last_week: 0,
        this_week: 0,
        total: 0,
      },
      services: {
        last_week: 0,
        this_week: 0,
        total: 0,
      },
    },
  });
}
