import { NgOptimizedImage } from "@angular/common";
import { HttpClient, httpResource } from "@angular/common/http";
import {
  Component,
  DOCUMENT,
  effect,
  inject,
  input,
  linkedSignal,
  Renderer2,
  signal,
  viewChild,
  ChangeDetectionStrategy
} from "@angular/core";
import {
  FormField,
  FormRoot,
  form,
  min,
  minLength,
  required,
} from "@angular/forms/signals";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { type MatStepper, MatStepperModule } from "@angular/material/stepper";
import { Meta, Title } from "@angular/platform-browser";
import { firstValueFrom, tap } from "rxjs";
import { type Model, PremiflyServiceLogo } from "shared";
import { environment } from "../../environments/environment";
import { SubscriptionPayment } from "./common/components/subscription-payment/subscription-payment";

@Component({
  selector: "premifly-subscribe",
  imports: [
    FormRoot,
    FormField,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatSelectModule,
    MatCardModule,
    NgOptimizedImage,
    PremiflyServiceLogo,
  ],
  templateUrl: "./subscribe.page.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./subscribe.page.css",
})
export class SubscribePage {
  user = input.required<Model.User | null>();

  #snackBar = inject(MatSnackBar);
  #document = inject(DOCUMENT);
  #dialog = inject(MatDialog);
  #title = inject(Title);
  #meta = inject(Meta);
  #renderer = inject(Renderer2);

  services = httpResource<Array<Model.Premifly.Service>>(
    () => ({
      url: `${environment.url.api}/premifly/services`,
      params: {
        status: "active",
      },
    }),
    {
      defaultValue: [],
    },
  );
  #http = inject(HttpClient);
  stepper = viewChild.required<MatStepper>("stepper");

  loginUrl = `${environment.url.auth.replace(/^https?:/, this.#document.location.protocol)}/login?callback=${this.#document.location.href}`;
  signupUrl = `${environment.url.auth.replace(/^https?:/, this.#document.location.protocol)}/signup?callback=${this.#document.location.href}`;

  phones = [
    "Iphone 4/4S",
    "Iphone 5/5S/5E",
    "Iphone 6/6S/6+",
    "Iphone 7/7+7S/7S+",
    "Iphone 8/8+8S/8S+",
    "Iphone X/XR/XS/Xs MAX",
    "Iphone 11/11 Pro/11 Pro MAX",
    "Iphone 12/12 Pro/12 Pro MAX",
    "Iphone 13/13 Pro/13 Pro MAX",
    "Iphone 14/14+/14 Pro/14 Pro MAX",
    "Iphone 15/15+/15 Pro/15 Pro MAX",
    "Iphone 16/16+/16 Pro/16 Pro MAX",
    "Iphone 17/17 Air",
    "Samsung S21/S21+/S21 Ultra",
    "Samsung S22/S22+/S22 Ultra",
    "Samsung S23/S23+/S23 Ultra",
    "Samsung S24/S24+/S24 Ultra",
    "Samsung S25/S25+/S25 Ultra",
    "Samsung Z Fold 5/6",
    "Samsung Z Flip 5/6",
    "Lg TV",
    "Hisense TV",
    "Samsung TV",
    "Other",
  ];

  formModel = linkedSignal(
    () => ({
      service_id: "",
      device_type: "",
      duration: 1,
      phone: this.user()?.phone || "",
    }),
    {
      debugName: "Subscription Form Model",
    },
  );

  form = form(
    this.formModel,
    (root) => {
      required(root.service_id, {
        message: "Please select a service",
        when: ({ stateOf }) => stateOf(root).touched(),
      });

      required(root.device_type, {
        message: "Please select your device",
        when: () => {
          return ["prime-video", "netflix"].includes(
            String(this.service()?.slug),
          );
        },
      });

      min(root.duration, 1);

      required(root.phone, {
        message: "Please Enter your phone number",
        when: ({ stateOf }) => stateOf(root).touched(),
      });
      minLength(root.phone, 8, {
        message: "The minimum length of your phone number should be 8 digits",
      });
    },
    {
      name: "Subscription Form",
      submission: {
        action: async (tree, detail) => {
          return firstValueFrom(
            this.#http
              .post<void>(
                `${environment.url.api}/premifly/subscription`,
                tree().value(),
              )
              .pipe(
                tap(() => {
                  this.stepper().next();
                  this.#snackBar.open(
                    `You successfully subscribed to ${this.service()?.name}`,
                    "",
                    {
                      duration: 5000,
                      horizontalPosition: "end",
                      verticalPosition: "top",
                    },
                  );
                  this.form().reset({
                    service_id: "",
                    duration: 1,
                    device_type: "",
                    phone: this.user()?.phone || "",
                  });
                }),
              ),
          );
        },
      },
    },
  );

  service = signal<Model.Premifly.Service | undefined>(undefined);

  serviceEffect = effect(() => {
    if (this.form.service_id().value()) {
      this.service.set(
        this.services
          .value()
          .find((s) => s.id === this.form.service_id().value()),
      );
    }
  });

  openPaymentModal() {
    const dialogRef = this.#dialog.open(SubscriptionPayment, {
      data: {
        service: this.service()!,
        duration: this.form.duration().value(),
        phone: this.form.phone().value(),
        device_type: this.form.device_type().value(),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.#snackBar.open(
          `A confirmation email with instructions will be sent to ${this.user()?.email} after payment has been confirmed`,
          "close",
        );

        this.form().reset({
          service_id: "",
          duration: 1,
          device_type: "",
          phone: this.user()?.phone || "",
        });
      }
    });
  }

  ngOnInit() {
    const title = this.#title.getTitle();
    const description =
      "Get started with Premifly — choose your favorite premium service, pick a plan, and subscribe in minutes. Affordable access to Netflix, Spotify, AI tools, and more.";
    const url = `${this.#document.location.protocol}//${this.#document.location.hostname}${this.#document.location.pathname}`;
    const image =
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqr7IPFS4QyPgmXHcBj6lP9_f-cVqwvrIj9cUdSPF3rMWekI7Rwxeh9YDRiSAfyMOnKJMXSZ7ruStYbN_WmS6TFS6uklZ874WgDsElFPRLhzuJMggDzY1r7LXjruuNDLYAhRGNDSBcVWkgpZ44OrAu9pF_BJ59wY_QhTp0U3ivgAuOw3sk7FRGu-9Lqm6CxhEoSaWRgSdCRDvlUSskSJPjAd8-eMSmt4sumpz-hxrrGDyUYfpy_j-idD5PPISmGIJiwtE4Tjjq32yk";

    this.#meta.updateTag({
      id: "description",
      name: "description",
      content: description,
    });
    this.#meta.updateTag({
      id: "keywords",
      name: "keywords",
      content:
        "premifly subscribe, buy premium subscription, affordable Netflix, cheap streaming plans, premium service signup, AI tools subscription, stundz",
    });

    // Open Graph tags
    this.#meta.updateTag({
      id: "og:title",
      property: "og:title",
      content: title,
    });
    this.#meta.updateTag({
      id: "og:description",
      property: "og:description",
      content: description,
    });
    this.#meta.updateTag({
      id: "og:type",
      property: "og:type",
      content: "website",
    });
    this.#meta.updateTag({
      id: "og:url",
      property: "og:url",
      content: url,
    });
    this.#meta.updateTag({
      id: "og:site_name",
      property: "og:site_name",
      content: "Premifly",
    });
    this.#meta.updateTag({
      id: "og:image",
      property: "og:image",
      content: image,
    });

    // Twitter Card tags
    this.#meta.updateTag({
      id: "twitter:card",
      name: "twitter:card",
      content: "summary_large_image",
    });
    this.#meta.updateTag({
      id: "twitter:title",
      name: "twitter:title",
      content: title,
    });
    this.#meta.updateTag({
      id: "twitter:description",
      name: "twitter:description",
      content: description,
    });
    this.#meta.updateTag({
      id: "twitter:image",
      name: "twitter:image",
      content: image,
    });
  }
}
