import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "past-questions",
		children: [
			{
				path: "",
				pathMatch: "full",
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
		path: "past-question/:past-question",
		children: [
			{
				path: "",
				pathMatch: "full",
				loadComponent: () => import("./show/show.page").then((m) => m.ShowPage),
			},
		],
	},
];
