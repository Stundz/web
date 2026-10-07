import type { ActivatedRouteSnapshot, Routes } from "@angular/router";
import { inject } from "@angular/core";
import { map } from "rxjs";
import { premiflyAccountServicesResolver } from "shared/resolvers";
import { PremiflyAccount } from "shared/services";

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
          service: (route: ActivatedRouteSnapshot) => {
            const accountId = route.pathFromRoot
              .map((snapshot) => snapshot.params["account"])
              .find(Boolean);
            return inject(PremiflyAccount).getServices(accountId).pipe(
              map((services) => {
                const service = services.data.find(
                  (item) => item.id === route.params["service"],
                );
                if (!service) throw new Error("Account service not found");
                return service;
              }),
            );
          },
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
