export interface Paginated<T> {
	data: Array<T>;
	meta: {
		/** The total number of items to be paginated */
		total: number;

		/**
		 * The start index of the pagination
		 */
		from: number;

		/**
		 * The index of the last item of the pagination
		 */
		to: number;

		/**
		 * The current page of the pagination
		 */
		current_page: number;

		/**
		 * The number of items sent per page
		 */
		per_page: number;
	};
	links: Record<string, any>;
}
