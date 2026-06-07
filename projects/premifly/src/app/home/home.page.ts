import { httpResource } from "@angular/common/http";
import { Component, DOCUMENT, inject, input, Renderer2 } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { Meta, Title } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";
import type { Model } from "shared";
import { environment } from "../../environments/environment";

@Component({
  selector: "premifly-home",
  imports: [MatButtonModule, MatCardModule, RouterLink],
  templateUrl: "./home.page.ng.html",
  styleUrl: "./home.page.css",
})
export class HomePage {
  #document = inject(DOCUMENT);
  #meta = inject(Meta);
  #renderer = inject(Renderer2);
  #title = inject(Title);
  user = input.required<Model.User | null>();
  services = httpResource<Array<Model.Premifly.Service>>(
    () => `${environment.url.api}/premifly/services`,
    {
      defaultValue: [],
    },
  );

  signupUrl = `${environment.url.auth.replace(/^https?:/, this.#document.location.protocol)}/signup?callback=${this.#document.location.href}`;

  ngAfterViewInit() {
    const title = this.#title.getTitle();
    const description =
      "Unlock premium digital subscriptions at a fraction of the cost. Save big on streaming, AI, and productivity services with Premifly's exclusive plans.";
    const url = `${this.#document.location.protocol}//${this.#document.location.hostname}`;
    const image =
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqr7IPFS4QyPgmXHcBj6lP9_f-cVqwvrIj9cUdSPF3rMWekI7Rwxeh9YDRiSAfyMOnKJMXSZ7ruStYbN_WmS6TFS6uklZ874WgDsElFPRLhzuJMggDzY1r7LXjruuNDLYAhRGNDSBcVWkgpZ44OrAu9pF_BJ59wY_QhTp0U3ivgAuOw3sk7FRGu-9Lqm6CxhEoSaWRgSdCRDvlUSskSJPjAd8-eMSmt4sumpz-hxrrGDyUYfpy_j-idD5PPISmGIJiwtE4Tjjq32yk";

    // Canonical URL
    // const existingCanonical = this.#document.querySelector(
    //   "link[rel='canonical']",
    // );
    // if (existingCanonical) {
    //   this.#renderer.removeChild(this.#document.head, existingCanonical);
    // }
    // const link: HTMLLinkElement = this.#renderer.createElement("link");
    // this.#renderer.setAttribute(link, "rel", "canonical");
    // this.#renderer.setAttribute(link, "href", url);
    // this.#renderer.appendChild(this.#document.head, link);

    this.#meta.updateTag({
      id: "description",
      name: "description",
      content: description,
    });
    this.#meta.updateTag({
      id: "keywords",
      name: "keywords",
      content:
        "premifly, premium subscriptions, affordable streaming, discount subscriptions, Netflix, AI tools, music streaming, digital services, stundz",
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
