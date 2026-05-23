import type { Routes } from "@angular/router";
import { premiflyAccountsResolver, premiflyAccountResolver } from "shared";

export const routes: Routes = [
	{
		path: "accounts",
		children: [
			{
				path: "",
				pathMatch: "full",
				resolve: {
					accounts: premiflyAccountsResolver,
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
		path: "account",
		children: [
			{
				path: ":account",
				resolve: {
					account: premiflyAccountResolver,
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
