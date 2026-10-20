import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  selector: "plug-about",
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIcon],
  templateUrl: "./about.page.ng.html",
  styleUrl: "./about.page.scss",
})
export class AboutPage {}
