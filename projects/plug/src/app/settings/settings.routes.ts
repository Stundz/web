import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "settings",
		loadComponent: () => import("./settings.page").then((m) => m.SettingsPage),
		children: [],
	},
];
