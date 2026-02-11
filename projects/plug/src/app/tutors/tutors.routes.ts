import { Routes } from "@angular/router";
import { tutorResolver } from "../common/resolvers/tutor-resolver";

export const routes: Routes = [
	{
		path: "tutors",
		children: [
			{
				path: "",
				pathMatch: "full",
				title:
					"Find Your Perfect Tutor Today and Get Mentored througout your studies",
				loadComponent: () =>
					import("./index/index.page").then((m) => m.IndexPage),
			},
			{
				path: "apply",
				title: "Apply to be a Tutor and Start Teaching Today",
				loadComponent: () =>
					import("./create/create.page").then((m) => m.CreatePage),
			},
		],
	},
	{
		path: "tutor",
		children: [
			{
				path: "",
				pathMatch: "full",
				redirectTo: "../tutors",
			},
			{
				path: ":tutor",
				title: "Certified plug tutor",
				resolve: { tutor: tutorResolver },
				loadComponent: () => import("./show/show.page").then((m) => m.ShowPage),
			},
		],
	},
];
