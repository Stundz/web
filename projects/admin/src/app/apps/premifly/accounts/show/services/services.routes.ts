import type { Routes } from "@angular/router";
import { premiflyAccountServicesResolver } from "shared";

export const routes: Routes = [
  {
    path: "services",
    children: [
      {
        path: "",
        pathMatch: "full",
        resolve: {
          services: premiflyAccountServicesResolver,
        },
        runGuardsAndResolvers: "paramsOrQueryParamsChange",
        loadComponent: () =>
          import("./index/index.page").then((m) => m.IndexPage),
      },
    ],
  },
  {
    path: "service",
    children: [
      {
        path: ":service",
        resolve: {
          // service: premiflyAccountResolver,
        },
        children: [
          {
            path: "",
            pathMatch: "full",
            loadComponent: () =>
              import("./show/show.page").then((m) => m.ShowPage),
          },
          {
            path: "edit",
            loadComponent: () =>
              import("./edit/edit.page").then((m) => m.EditPage),
          },
        ],
      },
    ],
  },
];
