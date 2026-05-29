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

			department?: Plug.Department;

			level?: Plug.Level;
		}

		export interface Level extends Model {
			name: string;
			program?: Plug.Program;
		}

		export interface Program extends Model {
			name: string;
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

			course?: Plug.Course;
			tutor?: Plug.Tutor;
			sessions?: Array<Plug.Session>;
			session?: Plug.Session;
			level?: Plug.Level;
		}

		export interface Tutor extends Model {
			user_id: User["id"];

			/** The tutor's first name */
			first_name: string;

			/** The tutor's lastname */
			last_name: string;

			/** The tutor's phone number */
			phone: string;

			/** Endorsement contains data showing approval from a lecturer */
			endorsement: Record<"email" | "name", string | null>;

			/** Indicates whether the tutor's application is under review or not. */
			valid_until: string | null;

			/** The list of courses lectured by the tutor */
			courses?: Array<Course>;

			/** The plug User owning this tutor model */
			user?: User;
		}

		export interface PastQuestion extends Model {
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
			level?: Plug.Level;
		}
	}

	export interface User extends Model {
		first_name: string;

		last_name: string;

		/** The email address of the user */
		email: string;

		/** The phone number of the user */
		phone: string;

		/** Plug related data */
		plug?: Plug.User;

		/** Premifly related user data */
		premifly: Premifly.User;
	}

	export namespace Premifly {
		export interface User extends Model {}

		export interface Service extends Model {
			name: string;
			price: number;
			icon: string;
			enabled: boolean;
			slug: string;
			limit: number | null;
			credentials?: {
				code: string;
				password: string;
				expires_at: string | null;
			};
		}

		export interface Account extends Model {
			email: string;
			services: Array<Service>;
			services_count: number;
			subscribers_count: number;
			subscriptions_count: number;
			credentials?: {
				password: string;
				code: string;
				expires_at: string | null;
			};
		}
	}
}
