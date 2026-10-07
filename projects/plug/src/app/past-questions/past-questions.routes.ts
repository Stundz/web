import { inject } from "@angular/core";
import { rxResource, toSignal } from "@angular/core/rxjs-interop";
import type { Routes } from "@angular/router";
import type { Plug } from "shared/models";
import { Auth } from "shared/services";
import type { Paginated } from "shared/types/shared-types";
import { pastQuestionResolver } from "../common/resolvers/past-question-resolver";
import { PastQuestion } from "../common/services/past-question";

export const routes: Routes = [
  {
    path: "past-questions",
    providers: [PastQuestion],
    children: [
      {
        path: "",
        title: "Search and Find past questions and solutions",
        pathMatch: "full",
        resources: ({ queryParams }) => {
          const pastQuestionService = inject(PastQuestion);
          const user = toSignal(inject(Auth).user$);

          return {
            pastQuestions: rxResource({
              params: () => {
                console.log("Paraming", queryParams());
                const query = { ...queryParams() };
                if (user()?.plug?.department?.faculty?.institution_id) {
                  query["institution_id"] =
                    user()?.plug?.department?.faculty?.institution_id;
                }

                return { queryParams: { ...query } };
              },
              stream: ({ params: { queryParams } }) =>
                pastQuestionService.getPastQuestions({ ...queryParams }),
              defaultValue: {
                data: [],
                meta: {
                  total: 0,
                  from: 0,
                  to: 0,
                  current_page: 0,
                  per_page: 15,
                },
                links: {},
              } as Paginated<Plug.PastQuestion>,
            }),
          };
        },
        runGuardsAndResolvers: "paramsOrQueryParamsChange",
        loadComponent: () =>
          import("./index/index.page").then((m) => m.IndexPage),
      },
      {
        path: "new",
        title: "Upload past questions and get rewarded",
        loadComponent: () =>
          import("./create/create.page").then((m) => m.CreatePage),
      },
    ],
  },
  {
    path: "past-question/:past-question",
    resolve: {
      "past-question": pastQuestionResolver,
    },
    children: [
      {
        path: "",
        pathMatch: "full",
        loadComponent: () => import("./show/show.page").then((m) => m.ShowPage),
      },
      {
        path: "",
        loadChildren: () =>
          import("./show/solutions/solutions.routes").then((m) => m.routes),
      },
    ],
  },
];
