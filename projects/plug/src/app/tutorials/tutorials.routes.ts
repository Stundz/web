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
				path: "tutorials",
				children: [
					{
						path: "",
						pathMatch: "full",
						resolve: { tutorials: tutorialsResolver },
						title: "Search tutorials",
						loadComponent: () =>
							import("./index/index.page").then((m) => m.IndexPage),
					},
					{
						path: "new",
						title: "Create a tutorial today and start making money",
						loadComponent: () =>
							import("./create/create.page").then((m) => m.CreatePage),
					},
				],
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
