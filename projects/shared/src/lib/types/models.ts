export interface Model {
	id: string;
	created_at: string;
	updated_at: string;
}

export namespace Model {
	export interface User {
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
		department: Department;
	}

	export interface Tutorial extends Model {
		name: string;
		description: string;
		course_code: string;
		course_title: string;
		tutor: User;
		department: Department;
    price: number;
    start: string
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
}
