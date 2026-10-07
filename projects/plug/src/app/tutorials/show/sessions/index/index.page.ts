import { Component, input } from "@angular/core";
import type { Plug } from "shared/models";
import type { Paginated } from "shared/types/shared-types";

@Component({
  selector: "plug-index",
  imports: [],
  templateUrl: "./index.page.ng.html",
  styleUrl: "./index.page.scss",
})
export class IndexPage {
  sessions = input.required<Paginated<Plug.Session>>();
}
