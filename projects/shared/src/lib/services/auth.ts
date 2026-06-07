import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  first,
  ignoreElements,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import { ENVIRONMENT, type Model } from "../types";

@Injectable({
  providedIn: "root",
})
export class Auth {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);
  #user = new BehaviorSubject<Model.User | null | undefined>(undefined);
  user$ = this.#user.asObservable().pipe(shareReplay());

  getUser() {
    return this.#http
      .get<Model.User>(`${this.#environment.url.api}/user`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return of(null);
          }

          return throwError(() => error);
        }),
        tap((user) => this.#user.next(user)),
        shareReplay(),
      );
  }

  signup(
    data: Pick<Model.User, "first_name" | "last_name" | "email"> &
      Record<"password" | "password_confirmation", string>,
  ) {
    return this.#http
      .post<void>(`${this.#environment.url.api}/signup`, data)
      .pipe(switchMap(() => this.getUser().pipe(first())));
  }

  login(data: Pick<Model.User, "email"> & { password: string }) {
    return this.#http
      .post<void>(`${this.#environment.url.api}/login`, data)
      .pipe(switchMap(() => this.getUser().pipe()));
  }
}
