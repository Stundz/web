import { Routes } from "@angular/router";
import { Tutorial } from "../common/services/tutorial";
import { provideNativeDateAdapter } from "@angular/material/core";
import {
	tutorialResolver,
	tutorialsResolver,
} from "../common/resolvers/tutorial-resolver";

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		providers: [Tutorial],
		resolve: { tutorials: tutorialsResolver },
		title: "Your tutorials sessions",
		loadComponent: () =>
			import("./index/index.page").then((m) => m.IndexPage),
	},
	{
		path: "new",
		loadComponent: () =>
			import("./create/create.page").then((m) => m.CreatePage),
	},
	{
		path: "",
		providers: [provideNativeDateAdapter()],
		resolve: {
			tutorial: tutorialResolver,
		},
		children: [
			{
				path: "",
				pathMatch: "full",
				loadComponent: () =>
					import("./show/show.page").then((m) => m.ShowPage),
			},
			{
				path: "sessions",
				loadChildren: () =>
					import("./show/sessions/sessions.routes").then(
						(m) => m.routes,
					),
			},
		],
	},
];
