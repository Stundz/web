import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () => import("./premifly.page").then((m) => m.PremiflyPage),
    title: "Unlock Premium for less",
  },
  {
    path: "",
    loadChildren: () =>
      import("./subscriptions/subscriptions.routes").then((m) => m.routes),
  },
  {
    path: "",
    loadChildren: () =>
      import("./accounts/accounts.routes").then((m) => m.routes),
  },
  {
    path: "",
    loadChildren: () => import("./users/users.routes").then((m) => m.routes),
  },
  {
    path: "",
    loadChildren: () =>
      import("./services/services.routes").then((m) => m.routes),
  },
];
