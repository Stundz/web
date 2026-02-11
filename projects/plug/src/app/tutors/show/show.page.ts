import { Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { Meta, Title } from "@angular/platform-browser";
import { Model } from "shared";

@Component({
	selector: "plug-show",
	imports: [MatTabsModule, MatButtonModule],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	#title = inject(Title);
	#meta = inject(Meta);
	tutor = input.required<Model.Plug.Tutor>();

	ngOnInit() {
		const description = `${this.tutor().first_name} ${this.tutor().last_name} is a tutor following the ${this.tutor()?.user?.level?.program?.name} Program in the ${this.tutor()?.user?.department?.faculty?.institution.name} and lecturing ${this.tutor()
			.courses?.map((c) => c.code)
			.join(", ")}`;

		this.#title.setTitle(
			`${this.tutor().first_name} ${this.tutor().last_name}, Plug tutor and mentor`,
		);

		this.#meta.addTags([
			{
				id: "keywords",
				name: "keywords",
				content: `plug, tutor, mentor, ${this.tutor().first_name.trim().replace(/ /g, ", ")}, ${this.tutor().last_name.trim().replace(/ /g, ", ")}, ${this.tutor()
					?.courses?.map((c) => c.title)
					.join(", ")}`,
			},
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
