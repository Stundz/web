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
					{
						path: "about",
						title: "The story behind plug. Who are we ?",
						loadComponent: () =>
							import("./about/about.page").then((m) => m.AboutPage),
					},
					{
						path: "contact",
						title: "Get in touch with plug for more assistance",
						loadComponent: () =>
							import("./contact/contact.page").then((m) => m.ContactPage),
					},
					{
						path: "pricing",
						title: "Explorer our plans and find what suits you",
						loadComponent: () =>
							import("./pricing/pricing.page").then((m) => m.PricingPage),
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
						path: "",
						loadChildren: () =>
							import("./past-questions/past-questions.routes").then(
								(m) => m.routes,
							),
					},
					{
						path: "",
						loadChildren: () =>
							import("./tutorials/tutorials.routes").then((m) => m.routes),
					},
					{
						path: "settings",
						loadChildren: () =>
							import("./settings/settings.routes").then((m) => m.routes),
					},
					{
						path: "",
						loadChildren: () =>
							import("./tutors/tutors.routes").then((m) => m.routes),
					},
				],
			},
		],
	},
];
