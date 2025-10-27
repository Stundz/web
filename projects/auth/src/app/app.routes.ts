import { Routes } from "@angular/router";
import { userResolver } from "shared";

export const routes: Routes = [
	{
		path: "",
		children: [
			{
				path: "",
				pathMatch: "full",
				resolve: { user: userResolver },
				loadComponent: () => import("./home/home.page").then((m) => m.HomePage),
			},
			{
				path: "login",
				loadComponent: () =>
					import("./login/login.page").then((m) => m.LoginPage),
			},
			{
				path: "signup",
				loadComponent: () =>
					import("./signup/signup.page").then((m) => m.SignupPage),
			},
			{
				path: "oauth",
				children: [
					{
						path: "authorize",
						loadComponent: () =>
							import("./oauth/authorize/authorize.page").then(
								(m) => m.AuthorizePage,
							),
					},
				],
			},
		],
	},
];
