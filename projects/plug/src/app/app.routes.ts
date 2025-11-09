import { Routes } from "@angular/router";
import { userResolver } from "shared";

export const routes: Routes = [
	{
		path: "",
		resolve: { user: userResolver },
		loadComponent: () =>
			import("./common/layouts/app.layout").then((m) => m.AppLayout),
		children: [
			{
				path: "",
				loadComponent: () =>
					import("./common/layouts/guest/guest.layout").then(
						(m) => m.GuestLayout,
					),
				children: [
					{
						path: "",
						title: "Plug, Where your academic success resides",
						loadComponent: () =>
							import("./home/home.page").then((m) => m.HomePage),
					},
				],
			},
			{
				path: "",
				loadComponent: () =>
					import("./common/layouts/auth/auth.layout").then((m) => m.AuthLayout),
				children: [
					{
						path: "dashboard",
						loadComponent: () =>
							import("./dashboard/dashboard.page").then((m) => m.DashboardPage),
					},
					{
						path: "projects",
						loadComponent: () =>
							import("./projects/projects.page").then((m) => m.ProjectsPage),
					},
					{
						path: "past-questions",
						loadChildren: () =>
							import("./past-questions/past-questions.routes").then(
								(m) => m.routes,
							),
					},
					{
						path: "past-question",
						loadChildren: () =>
							import("./past-questions/past-questions.routes").then(
								(m) => m.routes,
							),
					},
					{
						path: "tutorials",
						loadChildren: () =>
							import("./tutorials/tutorials.routes").then((m) => m.routes),
					},
					{
						path: "tutorial",
						loadChildren: () =>
							import("./tutorials/tutorials.routes").then((m) => m.routes),
					},
					{
						path: "settings",
						loadChildren: () =>
							import("./settings/settings.routes").then((m) => m.routes),
					},
					{
						path: "tutors",
						loadChildren: () =>
							import("./tutors/tutors.routes").then((m) => m.routes),
					},
				],
			},
		],
	},
];
