import { Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { Meta } from "@angular/platform-browser";
import { Model } from "shared";

@Component({
	selector: "plug-show",
	imports: [MatTabsModule, MatButtonModule],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	#meta = inject(Meta);
	tutor = input.required<Model.Plug.Tutor>();

	ngOnInit() {
		const description = `${this.tutor().first_name} ${this.tutor().last_name} is a tutor following the ${this.tutor()?.user?.level?.program?.name} Program in the ${this.tutor()?.user?.department?.faculty?.institution.name} and lecturing ${this.tutor()
			.courses?.map((c) => c.code)
			.join(", ")}`;

		this.#meta.addTags([
			{
				id: "description",
				name: "description",
				content: description,
			},
			{
				id: "og:description",
				property: "og:description",
				content: description,
			},
		]);
	}
}
