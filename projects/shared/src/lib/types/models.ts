export interface Model {
	id: string;
	created_at: string;
	updated_at: string;
}

export namespace Model {
	export interface User {
		/**
		 * The tutorial classes owned by the current user
		 */
		classes: Array<Tutorial>;

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
	}

	export interface Tutorial extends Model {
		course_code: string;
		course_title: string;
	}

	export interface Institution extends Model {
		name: string;
		slug: string;
		acronym: string;
	}
}
