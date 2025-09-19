import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "tutorials",
		title: "Your tutorials sessions",
		loadComponent: () => import("./index/index.page").then((m) => m.IndexPage),
	},
	{
		path: "tutorial",
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "../tutorials",
			},
			{
				path: ":tutorial",
				loadComponent: () => import("./show/show.page").then((m) => m.ShowPage),
			},
		],
	},
];
