import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  first,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import type { User } from "shared/models";
import { ENVIRONMENT } from "shared/types";

@Injectable({
  providedIn: "root",
})
export class Auth {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);
  #user = new BehaviorSubject<User | null | undefined>(undefined);
  user$ = this.#user.asObservable().pipe(shareReplay());

  getUser() {
    return this.#http.get<User>(`${this.#environment.url.api}/user`).pipe(
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
    data: Pick<User, "first_name" | "last_name" | "email"> &
      Record<"password" | "password_confirmation", string>,
  ) {
    return this.#http
      .post<void>(`${this.#environment.url.api}/signup`, data)
      .pipe(switchMap(() => this.getUser().pipe(first())));
  }

  login(data: Pick<User, "email"> & { password: string }) {
    return this.#http
      .post<void>(`${this.#environment.url.api}/login`, data)
      .pipe(switchMap(() => this.getUser().pipe()));
  }
}
