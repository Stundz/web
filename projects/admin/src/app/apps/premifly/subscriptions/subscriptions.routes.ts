import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "subscriptions",
		loadComponent: () => import("./index/index.page").then((m) => m.IndexPage),
	},
	{
		path: "subscription",
		children: [
			{
				path: ":subscription",
				children: [
					{
						path: "",
						loadComponent: () =>
							import("./show/show.page").then((m) => m.ShowPage),
					},
					{
						path: "edit",
						loadComponent: () =>
							import("./edit/edit.page").then((m) => m.EditPage),
					},
				],
			},
		],
	},
];
