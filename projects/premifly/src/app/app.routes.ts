import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "subscribe",
		loadComponent: () =>
			import("./subscribe/subscribe.page").then((m) => m.SubscribePage),
	},
];
