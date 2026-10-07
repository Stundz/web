import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "solutions",
    children: [
      {
        path: "",
        pathMatch: "full",
        title: "Past question solutions",
        loadComponent: () =>
          import("./index/index.page").then((m) => m.IndexPage),
      },
      {
        path: "create",
        title: "Create a past question solution",
        loadComponent: () =>
          import("./create/create.page").then((m) => m.CreatePage),
      },
    ],
  },
  {
    path: "solution/:solution",
    children: [
      {
        path: "",
        pathMatch: "full",
        title: "Past question solution",
        loadComponent: () =>
          import("./show/show.page").then((m) => m.ShowPage),
      },
      {
        path: "edit",
        title: "Edit a past question solution",
        loadComponent: () =>
          import("./edit/edit.page").then((m) => m.EditPage),
      },
    ],
  },
];
