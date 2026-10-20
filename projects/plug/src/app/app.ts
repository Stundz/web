import { Component, DOCUMENT, effect, inject, Renderer2 } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer, Meta } from "@angular/platform-browser";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter, map } from "rxjs";
import { environment } from "../environments/environment";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.ng.html",
  styleUrl: "./app.css",
})
export class App {
  #meta = inject(Meta);
  #description =
    "Ace your exams with past questions and course tutorials in one place. Study smarter, boost your grades, and earn money while you learn.";
  #renderer = inject(Renderer2);
  #document = inject(DOCUMENT);
  #router = inject(Router);
  #iconRegistry = inject(MatIconRegistry);
  #sanitizer = inject(DomSanitizer);

  readonly cannonical = toSignal(
    this.#router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => {
        const urlTree = this.#router.parseUrl(this.#router.url);

        urlTree.fragment = null;
        urlTree.queryParams = {};

        return `https://plug.${environment.domain}${urlTree.toString().replace(/\/$/, "")}`;
      }),
    ),
    {
      initialValue: "",
    },
  );

  #canonicalEffect = effect(() => {
    this.#meta.updateTag({
      id: "og:url",
      property: "og:url",
      content: this.cannonical(),
    });
    this.#meta.updateTag({
      id: "twitter:site",
      property: "twitter:site",
      content: this.cannonical(),
    });
  });

  constructor() {
    this.#iconRegistry.addSvgIconSetInNamespace(
      "material-symbols",
      this.#sanitizer.bypassSecurityTrustResourceUrl(
        "/icons/svg/material-symbols.svg",
      ),
      {
        viewBox: "0 0 24 24",
      },
    );
    effect(() => {
      const element = this.#document.querySelector("link[rel='canonical']");

      if (element) {
        this.#renderer.removeChild(this.#document.head, element);
      }

      if (this.cannonical()) {
        const link: HTMLLinkElement = this.#renderer.createElement("link");
        this.#renderer.setAttribute(link, "rel", "canonical");
        this.#renderer.setAttribute(link, "href", this.cannonical()!);
        this.#renderer.appendChild(this.#document.head, link);
      }
    });
  }

  ngOnInit() {
    this.#meta.addTags(
      [
        {
          id: "description",
          name: "description",
          content: this.#description,
        },
        {
          id: "keywords",
          name: "keywords",
          content:
            "plug, stundz, academic, study, tutorials, past questions, project, revision, education",
        },
        {
          id: "og:description",
          property: "og:description",
          content: this.#description,
        },
        {
          id: "og:image",
          property: "og:image",
          content:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
        },
        {
          id: "og:image.url",
          property: "og:image.url",
          content:
            "http://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
        },
        {
          id: "og:image.secure_url",
          property: "og:image.secure_url",
          content:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVfOU_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
        },
        {
          id: "og:site_name",
          property: "og:site_name",
          content: "Plug",
        },
        {
          id: "og:type",
          property: "og:type",
          content: "website",
        },
        {
          id: "twitter:site",
          property: "twitter:site",
          content: "Stundz",
        },
        {
          id: "twitter:card",
          property: "twitter:card",
          content: "Summary_card_large",
        },
      ],
      false,
    );
  }
}
