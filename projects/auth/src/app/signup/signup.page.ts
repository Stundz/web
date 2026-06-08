import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  signal,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  email,
  FormField,
  FormRoot,
  form,
  minLength,
  required,
  validate,
} from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { firstValueFrom, map, tap } from "rxjs";
import { Auth } from "shared";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-signup",
  imports: [
    RouterLink,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    FormField,
    FormRoot,
  ],
  templateUrl: "./signup.page.ng.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./signup.page.scss",
})
export class SignupPage {
  #route = inject(ActivatedRoute);
  #authService = inject(Auth);
  #document = inject(DOCUMENT);

  googleUrl = `${this.#document.location.protocol}//oauth.${environment.domain}/auth/google/redirect?redirect=${this.#document.location.href}`;

  form = form(
    signal({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms: false,
    }),
    (schema) => {
      required(schema.first_name, {
        message: "This field is required",
        when: ({ stateOf }) => stateOf(schema).touched(),
      });
      minLength(schema.first_name, 3, {
        message: "The first name should contain atleast 3 characters",
      });

      required(schema.last_name, {
        message: "This field is required",
        when: ({ stateOf }) => stateOf(schema).touched(),
      });
      minLength(schema.last_name, 3, {
        message: "The last name should contain atleast 3 characters",
      });

      required(schema.email, {
        message: "This field is required",
        when: ({ stateOf }) => stateOf(schema).touched(),
      });
      email(schema.email, { message: "This email is invalid" });

      required(schema.password, {
        message: "This field is required",
        when: ({ stateOf }) => stateOf(schema).touched(),
      });

      required(schema.password_confirmation, {
        message: "This field is required",
        when: ({ stateOf }) => stateOf(schema).touched(),
      });
      validate(schema.password_confirmation, ({ valueOf, value }) => {
        if (value() === valueOf(schema.password)) return undefined;

        return {
          kind: "same",
          message: "Passord confirmation do not match password",
        };
      });

      // Terms and conditions
      validate(schema.terms, ({ value }) => {
        if (value() === true) {
          return undefined;
        }

        return {
          kind: "boolean",
          message: "You must agree to the terms and conditions",
        };
      });
    },
    {
      name: "signup",
      submission: {
        action: async (schema) =>
          firstValueFrom(
            this.#authService.signup(schema().value()).pipe(
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
            ),
          ),
        onInvalid: async (field) => {
          console.log("Form is invalid", field().value());
        },
      },
    },
  );
}
