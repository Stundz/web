import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
	{
		path: "**",
		renderMode: RenderMode.Prerender,
	},
	{
		path: "dashboard",
		renderMode: RenderMode.Server,
	},
	{
		path: "past-questions",
		renderMode: RenderMode.Server,
	},
	{
		path: "past-question/:past-question/**",
		renderMode: RenderMode.Server,
	},
	{
		path: "tutorials",
		renderMode: RenderMode.Server,
	},
	{
		path: "tutorial/:tutorial/**",
		renderMode: RenderMode.Server,
	},
	{
		path: "tutors",
		renderMode: RenderMode.Server,
	},
	{
		path: "tutor/:tutor/**",
		renderMode: RenderMode.Server,
	},
];
