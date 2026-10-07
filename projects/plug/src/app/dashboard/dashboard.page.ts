import { DatePipe } from "@angular/common";
import { httpResource } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterLink } from "@angular/router";
import type { Plug, User } from "shared/models";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-dashboard",
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: "./dashboard.page.ng.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./dashboard.page.scss",
})
export class DashboardPage {
  user = input.required<User>();
  protected readonly today = new Date();
  protected readonly shortcuts = [
    {
      title: "Find a tutorial",
      description: "Find a tutor for your course.",
      route: "/tutorials",
      icon: "icon-[material-symbols--school-outline]",
    },
    {
      title: "Practice a past paper",
      description: "Prepare for your next exam.",
      route: "/past-questions",
      icon: "icon-[material-symbols--description-outline]",
    },
    {
      title: "Share a resource",
      description: "Upload a past paper.",
      route: "/past-questions/new",
      icon: "icon-[material-symbols--upload-file-outline]",
    },
  ];
  sessions = httpResource<Plug.Session[] | { data: Plug.Session[] }>(
    () => `https://api.${environment.domain}/plug/me/sessions`,
  );
  protected readonly upcomingSessions = computed(() => {
    const response = this.sessions.hasValue()
      ? this.sessions.value()
      : undefined;
    const sessions = Array.isArray(response)
      ? response
      : (response?.data ?? []);
    return sessions
      .filter(
        (session) => new Date(session.day).getTime() >= this.today.getTime(),
      )
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime())
      .slice(0, 3);
  });
  pastQuestions = httpResource<{ data: Plug.PastQuestion[] }>(
    () => ({
      url: `https://api.${environment.domain}/plug/past-questions`,
      params: { limit: 3 },
    }),
    { defaultValue: { data: [] } },
  );
}
