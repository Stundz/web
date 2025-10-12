import { Routes } from "@angular/router";
import { Tutorial } from "../common/services/tutorial";

export const routes: Routes = [
	{
		path: "tutorials",
		providers: [Tutorial],
		children: [
			{
				path: "",
				pathMatch: "full",
				title: "Your tutorials sessions",
				loadComponent: () =>
					import("./index/index.page").then((m) => m.IndexPage),
			},
			{
				path: "new",
				loadComponent: () =>
					import("./create/create.page").then((m) => m.CreatePage),
			},
		],
	},
	{
		path: "tutorial",
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "../tutorials",
			},
			{
				path: ":tutorial",
				loadComponent: () => import("./show/show.page").then((m) => m.ShowPage),
			},
		],
	},
];
