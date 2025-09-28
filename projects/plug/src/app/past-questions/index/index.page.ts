import { httpResource } from "@angular/common/http";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Model, Paginated } from "shared";

@Component({
	selector: "app-index",
	imports: [RouterLink],
	templateUrl: "./index.page.ng.html",
	styleUrl: "./index.page.scss",
})
export class IndexPage {
	// pastQuestions = [
	// 	{
	// 		course_code: "CEC218",
	// 		course_title: "Introduction to Machine Learning",
	// 		year: 2024,
	// 		intitution: "University of Buea",
	// 	},
	// 	{
	// 		course_code: "CEC318",
	// 		course_title: "Introduction to Cloud Computing",
	// 		year: 2025,
	// 		intitution: "University of Buea",
	// 	},
	// 	{
	// 		course_code: "CEC223",
	// 		course_title: "Algorithms and Complexity",
	// 		year: 2021,
	// 		intitution: "University of Buea",
	// 	},
	// 	{
	// 		course_code: "CEC218",
	// 		course_title: "Introduction to Machine Learning",
	// 		year: 2024,
	// 		intitution: "University of Buea",
	// 	},
	// 	{
	// 		course_code: "CEC218",
	// 		course_title: "Introduction to Machine Learning",
	// 		year: 2024,
	// 		intitution: "University of Buea",
	// 	},
	// 	{
	// 		course_code: "CEC218",
	// 		course_title: "Introduction to Machine Learning",
	// 		year: 2024,
	// 		intitution: "University of Buea",
	// 	},
	// 	{
	// 		course_code: "CEC218",
	// 		course_title: "Introduction to Machine Learning",
	// 		year: 2024,
	// 		intitution: "University of Buea",
	// 	},
	// ];

	pastQuestions = httpResource<Paginated<Model.PastQuestion>>(
		() => ({ url: "http://api.innova.localhost/plug/past-questions" }),
		{
			defaultValue: {
				data: [],
				meta: {
					total: 0,
					current: 0,
				},
				links: {},
			},
		},
	);
}
