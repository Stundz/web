import { Routes } from "@angular/router";
import {
	pastQuestionResolver,
	pastQuestionsResolver,
} from "../common/resolvers/past-question-resolver";
import { PastQuestion } from "../common/services/past-question";

export const routes: Routes = [
	{
		path: "past-questions",
		providers: [PastQuestion],
		children: [
			{
				path: "",
				pathMatch: "full",
				resolve: {
					pastQuestions: pastQuestionsResolver,
				},
				loadComponent: () =>
					import("./index/index.page").then((m) => m.IndexPage),
			},
			{
				path: "new",
				loadComponent: () =>
					import("./create/create.page").then((m) => m.CreatePage),
			},
		],
	},
	{
		path: "past-question/:past-question",
		resolve: {
			pastQuestion: pastQuestionResolver,
		},
		children: [
			{
				path: "",
				pathMatch: "full",
				loadComponent: () => import("./show/show.page").then((m) => m.ShowPage),
			},
		],
	},
];
