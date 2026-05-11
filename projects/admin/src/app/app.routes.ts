import type { Routes } from "@angular/router";
import { userResolver } from "shared";

export const routes: Routes = [
	{
		resolve: {
			user: userResolver,
		},
		children: [
			{
				path: "",
				loadComponent: () => import("./home/home.page").then((m) => m.HomePage),
			},
		],
	},
];
