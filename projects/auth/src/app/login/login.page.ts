import type { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  email,
  FormField,
  FormRoot,
  form,
  required,
} from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, RouterLink } from "@angular/router";
import {
  catchError,
  first,
  firstValueFrom,
  map,
  of,
  tap,
  throwError,
} from "rxjs";
import { Auth, type Model } from "shared";

@Component({
  selector: "app-login",
  imports: [
    RouterLink,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    FormField,
    FormRoot,
  ],
  templateUrl: "./login.page.ng.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./login.page.scss",
})
export class LoginPage {
  user = input.required<Model.User | undefined>();
  #route = inject(ActivatedRoute);
  #authService = inject(Auth);

  form = form(
    signal({
      email: "",
      password: "",
      remember: false,
    }),
    (root) => {
      required(root.email);
      email(root.email);
      required(root.password);
    },
    {
      submission: {
        action: (tree) => {
          return firstValueFrom(
            this.#authService.login(tree().value()).pipe(
              tap({
                next: () => {
                  window.location.href = this.#route.snapshot.queryParams[
                    "callback"
                  ]
                    ? this.#route.snapshot.queryParams["callback"]
                    : "";
                },
              }),
              map(() => undefined),
              catchError((error: HttpErrorResponse) => {
                if (error.status === 422) {
                  const mappedErrors = Object.entries(
                    error.error.errors,
                  ).flatMap(([key, messages]) => {
                    const keyParts = key.split(".");
                    let control: any = form;
                    for (const part of keyParts) {
                      if (control && part in control) {
                        control = control[part];
                      } else {
                        control = null;
                        break;
                      }
                    }

                    if (control) {
                      return (messages as string[]).map((message, i) => ({
                        fieldTree: control,
                        kind: String(i),
                        message,
                      }));
                    }
                    return [];
                  });
                  return of(mappedErrors);
                }
                return throwError(() => error);
              }),
            ),
          );
        },
      },
    },
  );
}
