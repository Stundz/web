import {
	Component,
	DOCUMENT,
	effect,
	Inject,
	inject,
	Renderer2,
	signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Meta } from "@angular/platform-browser";
import {
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	ResolveEnd,
	ResolveStart,
	Router,
	RouterLink,
	RouterLinkActive,
	RouterOutlet,
} from "@angular/router";
import { filter, map, of, switchMap, timer } from "rxjs";
import { Auth } from "shared";
import { environment } from "../environments/environment";

@Component({
	selector: "app-root",
	imports: [
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		MatProgressBarModule,
		MatMenuModule,
	],
	templateUrl: "./app.ng.html",
	styleUrl: "./app.css",
})
export class App {
	#router = inject(Router);
	#authService = inject(Auth);
	user = toSignal(this.#authService.user$, {
		requireSync: true,
	});
	protected readonly title = signal("plug");

	loading = toSignal(
		this.#router.events.pipe(
			filter(
				(event) =>
					event instanceof NavigationStart ||
					event instanceof NavigationEnd ||
					event instanceof NavigationError ||
					event instanceof NavigationCancel ||
					event instanceof ResolveStart ||
					event instanceof ResolveEnd,
			),
			switchMap((event) => {
				if (event instanceof NavigationStart || event instanceof ResolveStart) {
					return of(true);
				}

				return timer(300).pipe(map(() => false));
			}),
		),
	);

	readonly cannonical = toSignal(
		this.#router.events.pipe(
			filter((e) => e instanceof NavigationEnd),
			map(() => {
				const urlTree = this.#router.parseUrl(this.#router.url);

				urlTree.fragment = null;
				urlTree.queryParams = {};

				return `https://plug.${environment.domain}${urlTree.toString().replace(/\/$/, "")}`;
			}),
		),
	);

	constructor(
		@Inject(Meta) meta: Meta,
		@Inject(Renderer2) renderer: Renderer2,
		@Inject(DOCUMENT) document: Document,
	) {
		effect(() => {
			const element = document.querySelector("link[rel='canonical']");

			if (element) {
				renderer.removeChild(document.head, element);
			}

			if (this.cannonical()) {
				const link: HTMLLinkElement = renderer.createElement("link");
				renderer.setAttribute(link, "rel", "canonical");
				renderer.setAttribute(link, "href", this.cannonical()!);
				renderer.appendChild(document.head, link);
			}
		});

		meta.addTags(
			[
				{
					id: "description",
					name: "description",
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
					id: "og:description",
					property: "og:description",
					content:
						"A platform that helps students better thier grades and overcome academic challenges",
				},
				{
					id: "og:image",
					property: "og:image",
					content:
						"https://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
				},
				{
					id: "og:image.url",
					property: "og:image.url",
					content:
						"http://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVf0U_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
				},
				{
					id: "og:image.secure_url",
					property: "og:image.secure_url",
					content:
						"https://lh3.googleusercontent.com/aida-public/AB6AXuDVeHxpk_drXp9EcCmSEJuyY77JIswtRVfOU_jrFGMeXKJfnA2dSZgaQiQwkETC234nHhSIGxEf2eV_-i-FcmzSESBDjapcN4W4oQ62l0UFXAATz-RFvbRn9cljeJ8g6RBJuFztxtoh3vQBBHC2l-ZQfS0Bnh7fQJqLVLK3wI-b_TJpWc8EZVSqxYv5C3w68srJOxHH0OOe6ABsV17Qusv8f9-R2YbYXENCM76RbyBKK1Q65bM8By7pKJ2iPL3Mod6ZsivqTcrXV8oL",
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
			],
			false,
		);
	}
}
