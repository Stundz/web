import { inject } from "@angular/core";
import type { ActivatedRouteSnapshot, Routes } from "@angular/router";
import {
  premiflyServiceResolver,
  premiflyServiceSubscribersResolver,
  premiflyServicesResolver,
} from "shared";
import { PremiflyService } from "shared/services";

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
						pathMatch: "full",
						loadComponent: () =>
							import("./show/show.page").then((m) => m.ShowPage),
					},
					{
						path: "accounts",
						title: "Service Accounts",
						resolve: {
							accounts: (route: ActivatedRouteSnapshot) => inject(PremiflyService).getAccounts(
								route.parent!.params["service"], route.queryParams,
							),
						},
						runGuardsAndResolvers: "paramsOrQueryParamsChange",
						loadComponent: () => import("./show/accounts/accounts.page").then((m) => m.AccountsPage),
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
