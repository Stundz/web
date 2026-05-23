import type { Routes } from "@angular/router";
import { premiflyUsersResolver } from "shared";

export const routes: Routes = [
	{
		path: "users",
		resolve: {
			users: premiflyUsersResolver,
		},
		runGuardsAndResolvers: "paramsOrQueryParamsChange",
		loadComponent: () => import("./index/index.page").then((m) => m.IndexPage),
	},
	{
		path: "user",
		children: [
			{
				path: ":user",
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
