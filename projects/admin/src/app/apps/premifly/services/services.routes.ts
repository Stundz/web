import type { Routes } from "@angular/router";
import {
	premiflyServiceResolver,
	premiflyServiceSubscribersResolver,
	premiflyServicesResolver,
} from "shared";

export const routes: Routes = [
	{
		path: "services",
		children: [
			{
				path: "",
				pathMatch: "full",
				resolve: {
					services: premiflyServicesResolver,
				},
				runGuardsAndResolvers: "paramsOrQueryParamsChange",
				loadComponent: () =>
					import("./index/index.page").then((m) => m.IndexPage),
			},
			{
				path: "create",
				loadComponent: () =>
					import("./create/create.page").then((m) => m.CreatePage),
			},
		],
	},
	{
		path: "service",
		children: [
			{
				path: ":service",
				resolve: {
					service: premiflyServiceResolver,
				},
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
