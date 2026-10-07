import { inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import type { Routes } from "@angular/router";
import { sessionResolver } from "../../../common/resolvers/session-resolver";
import { Tutorial } from "../../../common/services/tutorial";

export const routes: Routes = [
  {
    path: "sessions",
    resources: (_ctx) => {
      const tutorialService = inject(Tutorial);

      return {
        sessions: rxResource({
          params: () => _ctx.params()["tutorial"],
          stream: ({ params }) => tutorialService.getSessions(params),
        }),
      };
    },
    children: [
      {
        path: "",
        pathMatch: "full",
        title: "Your tutorials sessions",
        loadComponent: () =>
          import("./index/index.page").then((m) => m.IndexPage),
      },
      {
        path: "create",
        loadComponent: () =>
          import("./create/create.page").then((m) => m.CreatePage),
      },
    ],
  },
  {
    path: "session/:session",
    resolve: {
      // session: sessionResolver,
    },
    children: [
      {
        resolve: {
          session: sessionResolver,
        },
        path: "",
        pathMatch: "full",
        loadComponent: () => import("./show/show.page").then((m) => m.ShowPage),
      },
      {
        path: "edit",
        loadComponent: () => import("./edit/edit.page").then((m) => m.EditPage),
      },
    ],
  },
];
