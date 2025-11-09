import { Routes } from "@angular/router";
import {
	pastQuestionResolver,
	pastQuestionsResolver,
} from "../common/resolvers/past-question-resolver";
import { PastQuestion } from "../common/services/past-question";

export const routes: Routes = [
	{
		path: "",
		pathMatch: "full",
		providers: [PastQuestion],
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
	{
		path: "",
		resolve: {
			pastQuestion: pastQuestionResolver,
		},
		loadComponent: () => import("./show/show.page").then((m) => m.ShowPage),
	},
];
