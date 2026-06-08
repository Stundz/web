import { CurrencyPipe } from "@angular/common";
import { HttpErrorResponse, httpResource } from "@angular/common/http";
import {
  Component,
  computed,
  inject,
  input,
  signal,
  type TemplateRef,
  viewChild,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormField, FormRoot, form, required } from "@angular/forms/signals";
import { MatButtonModule } from "@angular/material/button";
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MatDialog,
  MatDialogModule,
  type MatDialogRef,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { isAfter } from "date-fns";
import { catchError, firstValueFrom, map, tap, throwError } from "rxjs";
import {
  type Model,
  type Paginated,
  PremiflyAccount,
  PremiflyServiceLogo,
} from "shared";
import { environment } from "../../../../../../../environments/environment";

@Component({
  selector: "admin-index",
  imports: [
    RouterLink,
    CurrencyPipe,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    FormField,
    FormRoot,
    PremiflyServiceLogo,
  ],
  templateUrl: "./index.page.ng.html",
  styleUrl: "./index.page.css",
  providers: [provideNativeDateAdapter()],
})
export class IndexPage {
  #accountService = inject(PremiflyAccount);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #snackBar = inject(MatSnackBar);
  #dialog = inject(MatDialog);

  services = input.required<Paginated<Model.Premifly.Service>>();
  allServices = httpResource<Array<Model.Premifly.Service>>(() => ({
    url: `${environment.url.api}/premifly/services`,
  }));

  dialogTemplate = viewChild.required<TemplateRef<unknown>>("dialogTemplate");
  #dialogRef?: MatDialogRef<unknown>;

  // Compute unattached services by comparing IDs
  unattachedServices = computed(() => {
    const attachedIds = new Set((this.services().data || []).map((s) => s.id));
    return (this.allServices.value() || []).filter(
      (s) => !attachedIds.has(s.id),
    );
  });

  openAttachDialog() {
    this.#dialogRef = this.#dialog.open(this.dialogTemplate(), {
      width: "440px",
      panelClass: "custom-dialog-panel",
    });
  }

  closeDialog() {
    this.#dialogRef?.close();
  }

  formModel = signal({
    service_id: "",
    code: "",
    password: "",
    expires_at: new Date() as Date,
  });
  form = form(
    this.formModel,
    (root) => {
      required(root.service_id, {
        message: "Please select a service to attach",
      });

      required(root.expires_at, {
        message: "Please specify the date this service will expire",
      });
    },
    {
      submission: {
        action: (tree) => {
          // Retrieve the parent route parameters to obtain the account ID
          const accountId = this.#route.parent?.snapshot.params["account"];
          if (!accountId) {
            this.#snackBar.open(
              "Error: Account ID not found in route path.",
              "Close",
              { duration: 4000 },
            );
            return Promise.resolve();
          }

          return firstValueFrom(
            this.#accountService.attachService(accountId, tree().value()).pipe(
              tap({
                next: () => {
                  this.#snackBar.open(
                    "Service successfully attached to account!",
                    "Close",
                    { duration: 3000 },
                  );
                  this.form().reset({
                    service_id: "",
                    code: "",
                    password: "",
                    expires_at: new Date() as Date,
                  });
                  this.closeDialog();
                  // Re-trigger resolver to reload data on screen
                  this.#router.navigate([], {
                    queryParams: {
                      ...this.#route.snapshot.queryParams,
                      _t: Date.now(),
                    },
                    queryParamsHandling: "merge",
                  });
                },
              }),
              map(() => undefined),
              catchError((error) => {
                if (error instanceof HttpErrorResponse) {
                  this.#snackBar.open(
                    error?.error?.message ||
                      "Failed to attach service. Please try again.",
                    "Close",
                    { duration: 5000 },
                  );
                }
                return throwError(() => error);
              }),
            ),
          );
        },
      },
    },
  );

  dateFilter(d: any) {
    if (!d) return true;

    return !isAfter(new Date(), d);
  }
}
