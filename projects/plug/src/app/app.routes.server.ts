import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
	{
		path: "**",
		renderMode: RenderMode.Prerender,
	},
	{
		path: "past-question/:past-question",
		renderMode: RenderMode.Server,
	},
	{
		path: "tutorial/:tutorial",
		renderMode: RenderMode.Server,
	},
];
