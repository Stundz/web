import { httpResource } from "@angular/common/http";
import { Component, input } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { Model, Paginated } from "shared";
import { environment } from "../../../../environments/environment";
import { DatePipe } from "@angular/common";

@Component({
	selector: "plug-tutorial-sessions",
	imports: [MatExpansionModule, DatePipe],
	templateUrl: "./tutorial-sessions.ng.html",
	styleUrl: "./tutorial-sessions.scss",
})
export class TutorialSessions {
	tutorial = input.required<Model.Plug.Tutorial>();
	sessions = httpResource<Paginated<Model.Plug.Session>>(
		() => ({
			url: `https://api.${environment.domain}/plug/tutorial/${this.tutorial().id}/sessions`,
		}),
		{
			defaultValue: {
				data: [],
				links: {},
				meta: {
					current_page: 0,
					from: 0,
					to: 0,
					per_page: 5,
					total: 0,
				},
			},
		},
	);
}
