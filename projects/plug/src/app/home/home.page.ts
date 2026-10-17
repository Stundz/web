import { NgOptimizedImage } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { Meta, Title } from "@angular/platform-browser";
import { RouterLink } from "@angular/router";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-home",
  imports: [MatButtonModule, RouterLink, NgOptimizedImage, MatCardModule],
  templateUrl: "./home.page.ng.html",
  styleUrl: "./home.page.css",
})
export class HomePage {
  #title = inject(Title);
  #meta = inject(Meta);
  environment = environment;

  ngOnInit() {
    this.#meta.addTag({
      id: "og:title",
      property: "og:title",
      content: this.#title.getTitle(),
    });
  }
}
