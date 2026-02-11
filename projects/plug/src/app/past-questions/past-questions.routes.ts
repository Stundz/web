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
				title:
					"Search and Find past questions and solutions for all departments in your institution",
				pathMatch: "full",
				resolve: {
					pastQuestions: pastQuestionsResolver,
				},
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
