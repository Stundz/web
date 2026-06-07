import { Component, DOCUMENT, inject, Renderer2, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import {
  ActivatedRoute,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { map } from "rxjs";
import type { Model } from "../../../../dist/shared/types/shared";

@Component({
  selector: "premifly-root",
  imports: [RouterOutlet, RouterLink, MatButtonModule, RouterLinkActive],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = signal("premifly");
  #document = inject(DOCUMENT);
  #renderer = inject(Renderer2);
  route = toSignal(inject(ActivatedRoute).data.pipe());
  user = toSignal(
    inject(ActivatedRoute).data.pipe(
      map((data) => (data["user"] as Model.User) || null),
    ),
    {
      initialValue: null,
    },
  );

  ngAfterViewInit() {
    // Canonical URL
    const existingCanonical = this.#document.querySelector(
      "link[rel='canonical']",
    );
    const url = `${this.#document.location.protocol}//${this.#document.location.hostname}${this.#document.location.pathname}`;
    if (existingCanonical) {
      this.#renderer.removeChild(this.#document.head, existingCanonical);
    }
    const link: HTMLLinkElement = this.#renderer.createElement("link");
    this.#renderer.setAttribute(link, "rel", "canonical");
    this.#renderer.setAttribute(link, "href", url);
    this.#renderer.appendChild(this.#document.head, link);
  }
}
