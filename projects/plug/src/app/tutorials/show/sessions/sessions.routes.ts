import { Routes } from "@angular/router";
import { Tutorial } from "../../../common/services/tutorial";

export const routes: Routes = [
	{
		path: "sessions",
		children: [
			{
				path: "",
				pathMatch: "full",
				title: "Your tutorials sessions",
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
];
