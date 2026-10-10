import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "apps",
		title: "Applications | Stundz Admin",
		pathMatch: "full",
		loadComponent: () => import("./index/index.page").then((m) => m.IndexPage),
	},
	{
		path: "app",
		children: [
			{
				path: "premifly",
				loadChildren: () =>
					import("./premifly/premifly.routes").then((m) => m.routes),
			},
			{
				path: "plug",
				title: "Plug | Stundz Admin",
				loadComponent: () => import("./plug/plug.page").then((m) => m.PlugPage),
			},
		],
	},
];
