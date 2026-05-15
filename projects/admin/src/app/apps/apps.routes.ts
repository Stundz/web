import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "apps",
		pathMatch: "full",
		loadComponent: () => import("./index/index.page").then((m) => m.IndexPage),
	},
	{
		path: "app",
		children: [
			{
				path: "premifly",
				loadComponent: () =>
					import("./premifly/premifly.page").then((m) => m.PremiflyPage),
			},
			{
				path: "plug",
				loadComponent: () => import("./plug/plug.page").then((m) => m.PlugPage),
			},
		],
	},
];
