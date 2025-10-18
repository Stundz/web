import { Component, signal } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: "app-root",
	imports: [RouterOutlet],
	templateUrl: "./app.ng.html",
	styleUrl: "./app.scss",
})
export class App {
	protected readonly title = signal("plug");

	constructor(meta: Meta) {
		meta.addTags([
			{
				id: "description",
				name: "description",
				content:
					"A platform that helps students better thier grades and overcome academic challenges",
			},
			{
				id: "og:description",
				property: "og:description",
				content:
					"A platform that helps students better thier grades and overcome academic challenges",
			},
			{
				id: "keywords",
				name: "keywords",
				content:
					"plug, stundz, academic, study, tutorials, past questions, project, revision, education",
			},
			{
				id: "og:image",
				property: "og:image",
				content:
					"https://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
			},
			{
				id: "og:image.url",
				property: "og:image",
				content:
					"http://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
			},
			{
				id: "og:image.secure_url",
				property: "og:image",
				content:
					"http://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
			},
			{
				id: "og:site_name",
				property: "og:site_name",
				content: "Plug",
			},
			{
				id: "og:type",
				property: "og:type",
				content: "website",
			},
		]);
	}
}
