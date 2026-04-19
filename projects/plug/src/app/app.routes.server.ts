import { RenderMode, type ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
	{
		path: "",
		renderMode: RenderMode.Prerender,
	},
	{
		path: "contact",
		renderMode: RenderMode.Prerender,
	},
	{
		path: "about",
		renderMode: RenderMode.Prerender,
	},
	{
		path: "**",
		renderMode: RenderMode.Server,
	},
];
