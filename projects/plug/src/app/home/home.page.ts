import { NgOptimizedImage } from "@angular/common";
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-home",
  imports: [MatButtonModule, RouterLink, NgOptimizedImage, MatCardModule],
  templateUrl: "./home.page.ng.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./home.page.css",
})
export class HomePage {
  environment = environment;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const destroyRef = inject(DestroyRef);

    // Browser-only enhancement: SSR and unsupported browsers keep content visible.
    afterNextRender(() => {
      if (
        typeof IntersectionObserver === "undefined" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;

      const elements =
        host.nativeElement.querySelectorAll<HTMLElement>(".reveal");
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.remove("reveal-pending");
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.8 },
      );

      // Don't hide content already visible, including restored scroll positions.
      for (const element of elements) {
        if (element.getBoundingClientRect().top < window.innerHeight) continue;
        element.classList.add("reveal-pending");
        observer.observe(element);
      }
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
