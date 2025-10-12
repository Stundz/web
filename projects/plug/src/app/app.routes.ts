import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("./common/layouts/guest/guest.layout").then((m) => m.GuestLayout),
		children: [
			{
				path: "",
				title: "Plug, Where your academic success resides",
				loadComponent: () => import("./home/home.page").then((m) => m.HomePage),
			},
			{
				path: "login",
				title: "Login to your account.",
				loadComponent: () =>
					import("./login/login.page").then((m) => m.LoginPage),
			},
			{
				path: "signup",
				title: "Join our platform today and get access to endless resources",
				loadComponent: () =>
					import("./signup/signup.page").then((m) => m.SignupPage),
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
				path: "",
				loadChildren: () =>
					import("./past-questions/past-questions.routes").then(
						(m) => m.routes,
					),
			},
			{
				path: "projects",
				loadComponent: () =>
					import("./projects/projects.page").then((m) => m.ProjectsPage),
			},
			{
				path: "",
				loadChildren: () =>
					import("./tutorials/tutorials.routes").then((m) => m.routes),
			},
			{
				path: "",
				loadChildren: () =>
					import("./settings/settings.routes").then((m) => m.routes),
			},
		],
	},
];
