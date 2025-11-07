export interface Model {
	id: string;
	created_at: string;
	updated_at: string;
}

export namespace Model {
	export namespace Plug {
		export interface User
			extends Pick<
				Model.User,
				| "first_name"
				| "last_name"
				| "email"
				| "id"
				| "created_at"
				| "updated_at"
			> {
			/**
			 * The tutorial classes owned by the current user
			 */
			sessions: Array<Plug.Tutorial>;

			tutor?: Plug.Tutor;
		}

		export interface Session extends Model {
			tutorial_id: Tutorial["id"];

			/** The day of the week at which the session is/was scheduled */
			day: string;

			/** The time at which the session will begin */
			time: string;

			/** List of Objectives to be attained this session */
			objectives: Array<string>;

			/** Time in minutes which how long a session will last */
			duration: number;

			/** The venue in which the tutorial session will take place or took place in */
			venue: string | undefined;

			/** The number of students in a given session */
			students_count: number;

			tutorial?: Tutorial;
		}

		export interface Tutorial extends Model {
			course_id: string;
			tutor_id: string;

			name: string;
			description: string;

			/** The amount to be paid by students for session participations */
			price: number;

			course?: Course;
			tutor?: Tutor;
			sessions?: Array<Session>;
			session?: Session;
		}

		export interface Tutor extends Model {
			user_id: User["id"];
			user?: User;
		}

		export interface PastQuestion extends Model {
			course_title: string;
			course_code: string;
			institution: Institution;
			solutions_count: number;
			year: number;
			course: Course;
		}

		export interface Institution extends Model {
			name: string;
			slug: string;
			acronym: string;
		}

		export interface Faculty extends Model {
			institution_id: Institution["id"];
			name: string;
			institution: Institution;
		}

		export interface Department extends Model {
			name: string;
			faculty: Faculty;
		}

		export interface Course extends Model {
			title: string;
			code: string;
			department: Department;
		}
	}

	export interface User extends Model {
		first_name: string;

		last_name: string;

		email: string;

		plug?: Plug.User;
	}
}
