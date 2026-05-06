import type { Routes } from "@angular/router";
import { sessionResolver } from "../../../common/resolvers/session-resolver";

export const routes: Routes = [
	{
		path: "sessions",
		// providers: [Session],
		resolve: {
			// sessions: sessionsResolver,
		},
		children: [
			{
				path: "",
				pathMatch: "full",
				title: "Your tutorials sessions",
				resolve: {},
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
		path: "session/:session",
		resolve: {
			// session: sessionResolver,
		},
		children: [
			{
				resolve: {
					session: sessionResolver,
				},
				path: "",
				pathMatch: "full",
				loadComponent: () => import("./show/show.page").then((m) => m.ShowPage),
			},
			{
				path: "edit",
				loadComponent: () => import("./edit/edit.page").then((m) => m.EditPage),
			},
		],
	},
];
