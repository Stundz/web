import { httpResource } from "@angular/common/http";
import { Component, input } from "@angular/core";

@Component({
	selector: "app-show",
	imports: [],
	templateUrl: "./show.page.ng.html",
	styleUrl: "./show.page.scss",
})
export class ShowPage {
	id = input.required({ alias: "past-question" });
	question = httpResource<any>(
		() => `http://api.innova.localhost/plug/past-question/${this.id()}`,
	);
}
