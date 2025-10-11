import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";

@Component({
	selector: "stundz-input",
	imports: [],
	templateUrl: "./input.html",
	styleUrl: "./input.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input  {}
