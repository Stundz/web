import type { Plug, User } from "shared/models";
import { DatePipe, DOCUMENT } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";
import { addMinutes } from "date-fns";

import { environment } from "../../../environments/environment";
import { BookingForm } from "../../common/components/booking-form/booking-form";

@Component({
  selector: "plug-show-tutorial",
  imports: [
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    RouterLink,
    DatePipe,
  ],
  templateUrl: "./show.page.ng.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./show.page.scss",
})
export class ShowPage {
  tutorial = input.required<Plug.Tutorial>();
  user = input.required<User | undefined>();

  #dialog = inject(MatDialog);
  #document = inject(DOCUMENT);

  loginUrl = `https://auth.${environment.domain}/login?callback=${this.#document.location.href}`;

  endTime = computed(() => {
    return addMinutes(
      this.tutorial()?.session?.day || new Date(),
      this.tutorial()?.session?.duration || 0,
    );
  });

  book() {
    this.#dialog.open(BookingForm, {
      data: this.tutorial().session,
    });
  }
}
