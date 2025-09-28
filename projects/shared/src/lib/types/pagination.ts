export interface Paginated<T> {
	data: Array<T>;
	meta: {
		total: number;

		current: number;
	};
	links: Record<string, any>;
}
