import type { Routes } from "@angular/router";
import { authGuard, guestGuard } from "shared/guards";
import { userResolver } from "shared/resolvers";

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
            pathMatch: "full",
            title: "Plug: Past Questions, Tutorials & Earn While You Study",
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
            canActivate: [guestGuard],
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
            canActivate: [authGuard],
            loadComponent: () =>
              import("./dashboard/dashboard.page").then((m) => m.DashboardPage),
          },
          {
            path: "my-sessions",
            canActivate: [authGuard],
            loadComponent: () =>
              import("./my-sessions/my-sessions.page").then(
                (m) => m.MySessionsPage,
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
