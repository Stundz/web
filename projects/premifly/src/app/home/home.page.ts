import { DOCUMENT } from "@angular/common";
import { httpResource } from "@angular/common/http";
import { Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, RouterLink } from "@angular/router";
import type { Model } from "shared";
import { environment } from "../../environments/environment";

@Component({
  selector: "premifly-home",
  imports: [MatButtonModule, RouterLink],
  templateUrl: "./home.page.ng.html",
  styleUrl: "./home.page.css",
})
export class HomePage {
  #document = inject(DOCUMENT);
  user = input.required<Model.User | null>();
  services = httpResource<Array<Model.Premifly.Service>>(
    () => `${environment.url.api}/premifly/services`,
    {
      defaultValue: [],
    },
  );

  signupUrl = `${environment.url.auth.replace(/^https?:/, this.#document.location.protocol)}/signup?callback=${this.#document.location.href}`;
}
