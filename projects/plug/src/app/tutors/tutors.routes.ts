import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "tutors",
		children: [
			{
				path: "",
				pathMatch: "full",
				loadComponent: () =>
					import("./index/index.page").then((m) => m.IndexPage),
			},
			{
				path: "application",
				title: "Become a tutor",
				loadComponent: () =>
					import("./create/create.page").then((m) => m.CreatePage),
			},
		],
	},
	{
		path: "tutor",
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "../tutors",
			},
			{
				path: ":tutor",
				loadComponent: () => import("./show/show.page").then((m) => m.ShowPage),
			},
		],
	},
];
