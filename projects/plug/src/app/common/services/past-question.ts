import { HttpClient } from "@angular/common/http";
import { effect, inject, Service, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { BehaviorSubject, distinctUntilChanged, filter, switchMap } from "rxjs";
import type { Plug } from "shared/models";
import type { Paginated } from "shared/types";
import { toFormData } from "shared/utils";
import { environment } from "../../../environments/environment";

@Service()
export class PastQuestion {
  #http = inject(HttpClient);

  readonly filters = signal<Record<string, string | number | boolean>>({});
  publisher = signal<string | undefined>(undefined);

  #filters = new BehaviorSubject<Record<string, string | number | boolean>>({});

  pastQuestions$ = this.#filters.asObservable().pipe(
    switchMap((filters) => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) =>
          key === "page" && value == 1 ? false : Boolean(value),
        ),
      );

      return this.#http.get<Paginated<Plug.PastQuestion>>(
        `https://api.${environment.domain}/plug/past-questions`,
        {
          params,
          // context: new HttpContext().set(HTTP_SKIP_ON_SERVER, true),
        },
      );
    }),
  );

  myPastQuestions$ = toObservable(this.publisher).pipe(
    filter((publisher) => publisher != undefined),
    distinctUntilChanged(),
    switchMap((publisher) =>
      this.#http.get<Paginated<Plug.PastQuestion>>(
        `https://api.${environment.domain}/plug/past-questions`,
        {
          params: {
            publisher,
          },
        },
      ),
    ),
  );

  constructor() {
    effect(() => {
      this.#filters.next(this.filters());
    });
  }

  getPastQuestions(params: Record<string, string | number>) {
    return this.#http.get<Paginated<Plug.PastQuestion>>(
      `https://api.${environment.domain}/plug/past-questions`,
      { params },
    );
  }

  getPastQuestion(id: string, params: Record<string, string | number> = {}) {
    return this.#http.get<Paginated<Plug.PastQuestion>>(
      `https://api.${environment.domain}/plug/past-question/${id}`,
      { params },
    );
  }

  create(payload: { course_id: string; file: File | null; year: number }) {
    return this.#http.post<void>(
      `https://api.${environment.domain}/plug/past-question`,
      toFormData(payload),
    );
  }
}
