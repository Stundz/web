import type { Routes } from "@angular/router";
import { userResolver } from "shared";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "prefix",
    resolve: {
      user: userResolver,
    },
    children: [
      {
        path: "",
        pathMatch: "full",
        title: "Subscribe to your favorite services at very affordable prices",
        loadComponent: () => import("./home/home.page").then((m) => m.HomePage),
      },
      {
        path: "subscribe",
        title: "Getting started, Provide your information to obtain a service",
        loadComponent: () =>
          import("./subscribe/subscribe.page").then((m) => m.SubscribePage),
      },
      {
        path: "dashboard",
        title: "Dashboard",
        loadComponent: () =>
          import("./dashboard/dashboard.page").then((m) => m.DashboardPage),
      },
    ],
  },
];
