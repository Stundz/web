export interface Model {
	id: string;
	created_at: string;
	updated_at: string;
}

export namespace Model {
	export interface User extends Model {
		first_name: string;

		last_name: string;

		email: string;

		/**
		 * The tutorial classes owned by the current user
		 */
		sessions: Array<Tutorial>;

		/**
		 * The tutorials classes the user subscribed to
		 */
		tutorials: Array<Tutorial>;
	}

	export interface PastQuestion extends Model {
		course_title: string;
		course_code: string;
		institution: Institution;
		solutions_count: number;
		year: number;
		course: Course;
	}

	export interface Tutorial extends Model {
		course_id: string;
		tutor_id: string;

		name: string;
		description: string;

		/** Time in minutes which how long a session will last */
		duration: number;

		course?: Course;
		tutor?: Tutor;
		department: Department;
		price: number;
		day: string;
		time: string;
		objectives: Array<string>;

		students_count: number;
	}

	export interface Tutor extends Model {
		user_id: string;
		user?: User;
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
