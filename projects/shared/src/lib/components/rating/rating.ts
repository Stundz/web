import { Component, input } from "@angular/core";

@Component({
	selector: "stundz-rating",
	imports: [],
	templateUrl: "./rating.html",
	styleUrl: "./rating.scss",
})
export class Rating {
	value = input.required<number>();
	total = input<number>(5);

	stars = Array.from({ length: this.total() }, (_, i) => i + 1);
}
