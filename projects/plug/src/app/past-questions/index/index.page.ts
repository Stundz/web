import { httpResource } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  debounce,
  disabled,
  FormField,
  form,
  validate,
} from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {
  MatPaginatorModule,
  type PageEvent,
} from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { map } from "rxjs";
import type { Plug, User } from "shared/models";
import type { Paginated } from "shared/types";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-index",
  imports: [
    RouterLink,
    FormField,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
  ],
  templateUrl: "./index.page.ng.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./index.page.scss",
})
export class IndexPage {
  user = input.required<User>();
  pastQuestions = input.required<Paginated<Plug.PastQuestion>>();

  #route = inject(ActivatedRoute);
  #router = inject(Router);
  currentYear = new Date().getFullYear();
  #filters = linkedSignal(() => ({
    q: this.#route.snapshot.queryParams["q"] || "",
    institution: this.user()?.plug?.department?.faculty?.institution_id || "",
    faculty: this.#route.snapshot.queryParams["faculty"] || "",
    department: this.#route.snapshot.queryParams["department"] || "",
    course: this.#route.snapshot.queryParams["course"] || "",
    year: this.#route.snapshot.queryParams["year"] || "",
  }));
  form = form(this.#filters, (fields) => {
    debounce(fields.q, 600);
    disabled(fields.institution, { when: () => !!this.user() });
    disabled(fields.faculty, {
      when: ({ valueOf }) => !valueOf(fields.institution),
    });
    disabled(fields.department, {
      when: ({ valueOf }) => !valueOf(fields.faculty),
    });
    disabled(fields.course, {
      when: ({ valueOf }) => !valueOf(fields.department),
    });
    validate(fields.year, ({ value }) => {
      const year = value();
      return year === "" ||
        (/^\d{4}$/.test(String(year)) &&
          Number(year) >= 1900 &&
          Number(year) <= this.currentYear)
        ? undefined
        : { kind: "year", message: "Enter a valid exam year." };
    });
  });
  institutions = httpResource<Array<Plug.Institution>>(
    () => ({
      url: `https://api.${environment.domain}/plug/institutions`,
    }),
    { defaultValue: [] },
  );
  faculties = httpResource<Array<Plug.Faculty>>(
    () =>
      this.form.institution().value()
        ? {
            url: `https://api.${environment.domain}/plug/institution/${this.form.institution().value()}/faculties`,
          }
        : undefined,
    { defaultValue: [] },
  );
  departments = httpResource<Array<Plug.Department>>(
    () =>
      this.form.faculty().value()
        ? {
            url: `https://api.${environment.domain}/plug/faculty/${this.form.faculty().value()}/departments`,
          }
        : undefined,
    { defaultValue: [] },
  );
  courses = httpResource<Array<Plug.Course>>(
    () =>
      this.form.department().value()
        ? {
            url: `https://api.${environment.domain}/plug/department/${this.form.department().value()}/courses`,
          }
        : undefined,
    { defaultValue: [] },
  );

  #navigatioEffectn = effect(() => {
    const values = Object.fromEntries(
      Object.entries({
        q: this.form.q().value()?.trim(),
        institution: this.form.institution().value(),
        faculty: this.form.faculty().value(),
        department: this.form.department().value(),
        course: this.form.course().value(),
        year: this.form.year().value(),
      }).filter(([_key, value]) => value !== "" && value !== null),
    );
    if (this.form().invalid()) return;

    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: values,
      queryParamsHandling: "replace",
    });
  });

  changePage(event: PageEvent) {
    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParamsHandling: "merge",
      queryParams: { page: event.pageIndex + 1, limit: event.pageSize },
    });
  }
}
