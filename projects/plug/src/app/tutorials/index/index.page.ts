import { NgOptimizedImage } from "@angular/common";
import { httpResource } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { debounce, disabled, FormField, form } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {
  MatPaginatorModule,
  type PageEvent,
} from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { addDays, format, isValid, parseISO } from "date-fns";
import { skip, tap } from "rxjs";
import type { Plug, User } from "shared/models";

import { environment } from "../../../environments/environment";
import { TutorialCard } from "../../common/components/tutorial-card/tutorial-card";
import { Tutorial } from "../../common/services/tutorial";
@Component({
  selector: "plug-tutorials-index",
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule,
    MatSelectModule,
    NgOptimizedImage,
    TutorialCard,
    MatChipsModule,
    MatDatepickerModule,
    FormField,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: "./index.page.ng.html",
  styleUrl: "./index.page.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    ngSkipHydration: "true",
  },
})
export class IndexPage {
  user = input.required<User>();
  #tutorialService = inject(Tutorial);
  #route = inject(ActivatedRoute);
  tutorials = toSignal(this.#tutorialService.tutorials$, { requireSync: true });
  #router = inject(Router);
  #meta = inject(Meta);
  #title = inject(Title);

  #queryParams = toSignal(this.#route.queryParams, { requireSync: true });
  today = format(new Date(), "yyyy-MM-dd");
  tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  filters = linkedSignal(() => {
    const params = this.#queryParams();
    return {
      q: String(params["q"] || ""),
      institution: String(
        this.user()?.plug?.department?.faculty?.institution_id ||
          params["institution"] ||
          "",
      ),
      faculty: String(params["faculty"] || ""),
      department: String(params["department"] || ""),
      course: String(params["course"] || ""),
      day: String(params["day"] || ""),
    };
  });
  tutorialFilters = form(this.filters, (fields) => {
    debounce(fields.q, 600);
    disabled(fields.institution, {
      when: () => !!this.user()?.plug?.department?.faculty?.institution_id,
    });
    disabled(fields.faculty, {
      when: ({ valueOf }) => !valueOf(fields.institution),
    });
    disabled(fields.department, {
      when: ({ valueOf }) => !valueOf(fields.faculty),
    });
    disabled(fields.course, {
      when: ({ valueOf }) => !valueOf(fields.department),
    });
  });
  selectedDay = computed(() => {
    const day = this.tutorialFilters.day().value();
    const date = day ? parseISO(day) : null;
    return date && isValid(date) ? date : null;
  });

  setDay(date: Date | null) {
    this.tutorialFilters
      .day()
      .value.set(date && isValid(date) ? format(date, "yyyy-MM-dd") : "");
  }

  institutions = httpResource<Plug.Institution[]>(
    () => `https://api.${environment.domain}/plug/institutions`,
    { defaultValue: [] },
  );
  faculties = httpResource<Plug.Faculty[]>(
    () =>
      this.tutorialFilters.institution().value()
        ? `https://api.${environment.domain}/plug/institution/${this.tutorialFilters.institution().value()}/faculties`
        : undefined,
    { defaultValue: [] },
  );
  departments = httpResource<Plug.Department[]>(
    () =>
      this.tutorialFilters.faculty().value()
        ? `https://api.${environment.domain}/plug/faculty/${this.tutorialFilters.faculty().value()}/departments`
        : undefined,
    { defaultValue: [] },
  );
  courses = httpResource<Plug.Course[]>(
    () =>
      this.tutorialFilters.department().value()
        ? `https://api.${environment.domain}/plug/department/${this.tutorialFilters.department().value()}/courses`
        : undefined,
    { defaultValue: [] },
  );

  #initialNavigation = true;
  paramsEffect = effect(() => {
    const values = {
      q: this.tutorialFilters.q().value().trim(),
      institution: this.tutorialFilters.institution().value(),
      faculty: this.tutorialFilters.faculty().value(),
      department: this.tutorialFilters.department().value(),
      course: this.tutorialFilters.course().value(),
      day: this.tutorialFilters.day().value(),
    };
    const params = this.#route.snapshot.queryParams;
    const initialNavigation = this.#initialNavigation;
    this.#initialNavigation = false;
    if (
      Object.entries(values).every(
        ([key, value]) => value === String(params[key] || ""),
      )
    )
      return;

    this.#router.navigate([], {
      relativeTo: this.#route,
      replaceUrl: true,
      queryParams: {
        ...Object.fromEntries(
          Object.entries(values).map(([key, value]) => [key, value || null]),
        ),
        page: initialNavigation ? params["page"] || null : null,
        semester: null,
      },
      queryParamsHandling: "merge",
    });
  });

  resetFilters() {
    this.tutorialFilters().reset({
      q: "",
      institution: String(
        this.user()?.plug?.department?.faculty?.institution_id || "",
      ),
      faculty: "",
      department: "",
      course: "",
      day: "",
    });
  }

  constructor() {
    this.#route.queryParams
      .pipe(
        takeUntilDestroyed(),
        skip(1),
        tap((params) => this.#tutorialService.filters.next(params)),
      )
      .subscribe();

    this.#meta.updateTag({
      id: "description",
      name: "description",
      content:
        "Search and filter through a wide range of tutorials to find the perfect tutor for you.",
    });
    this.#meta.updateTag({
      id: "og:title",
      property: "og:title",
      content: this.#title.getTitle(),
    });
    this.#meta.updateTag({
      id: "og:description",
      property: "og:description",
      content:
        "Search and filter through a wide range of tutorials to find the perfect tutor for you",
    });
    this.#meta.updateTag({
      id: "keywords",
      name: "keywords",
      content:
        "plug, stundz, study, tutorials, tutor, past questions, revision, education",
    });
  }

  handlePaginatorEvent(event: PageEvent) {
    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParamsHandling: "merge",
      queryParams: { page: event.pageIndex + 1, limit: event.pageSize },
    });
  }
}
