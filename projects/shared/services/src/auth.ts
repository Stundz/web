import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  first,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import type { User } from "shared/models";
import { ENVIRONMENT } from "shared/types";

@Service()
export class Auth {
  #http = inject(HttpClient);
  #environment = inject(ENVIRONMENT);
  #user = new BehaviorSubject<User | null | undefined>(undefined);

  /**
   * undefined    The users hasn't been fetched yet
   * null         The user has been fetched but unauthenticated
   * {User}       Authenticated
   */
  user$ = this.#user.asObservable().pipe(shareReplay());
  isAuthenticated$ = this.#user.asObservable().pipe(
    map((user) => !!user),
    shareReplay(),
  );

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

  logout() {
    return this.#http
      .post<void>(`https://api.${this.#environment.domain}/logout`, {})
      .pipe(
        tap(() => {
          window.location.replace("/");
          this.#user.next(undefined);
        }),
      );
  }
}
