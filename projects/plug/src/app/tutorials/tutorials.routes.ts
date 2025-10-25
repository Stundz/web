import { Routes } from "@angular/router";
import { Tutorial } from "../common/services/tutorial";
import { provideNativeDateAdapter } from "@angular/material/core";

export const routes: Routes = [
	{
		path: "tutorials",
		children: [
			{
				path: "",
				pathMatch: "full",
				title: "Your tutorials sessions",
				loadComponent: () =>
					import("./index/index.page").then((m) => m.IndexPage),
			},
			{
				path: "new",
				loadComponent: () =>
					import("./create/create.page").then((m) => m.CreatePage),
			},
		],
	},
	{
		path: "tutorial",
		providers: [provideNativeDateAdapter()],
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "../tutorials",
			},
			{
				path: ":tutorial",
				children: [
					{
						path: "",
						loadComponent: () =>
							import("./show/show.page").then((m) => m.ShowPage),
					},
					{
						path: "",
						loadChildren: () =>
							import("./show/sessions/sessions.routes").then((m) => m.routes),
					},
				],
			},
		],
	},
];
