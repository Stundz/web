import type { Routes } from "@angular/router";
import { userResolver } from "shared";

export const routes: Routes = [
	{
		path: "",
		resolve: {
			user: userResolver,
		},
		children: [
			{
				path: "",
				pathMatch: "full",
				loadComponent: () => import("./home/home.page").then((m) => m.HomePage),
			},
			{
				path: "",
				pathMatch: "prefix",
				loadChildren: () => import("./apps/apps.routes").then((m) => m.routes),
			},
		],
	},
];
