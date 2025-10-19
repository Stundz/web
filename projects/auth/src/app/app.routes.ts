import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () => import("./home/home.page").then((m) => m.HomePage),
	},
	{
		path: "login",
		loadComponent: () => import("./login/login.page").then((m) => m.LoginPage),
	},
	{
		path: "signup",
		loadComponent: () =>
			import("./signup/signup.page").then((m) => m.SignupPage),
	},
];
