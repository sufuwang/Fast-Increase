const Filter = {
	year(y: number | string) {
		return Filter.month(parseInt(y.toString()), [1, 12]);
	},
	month(y: number, m: [number, number] | number) {
		if (
			Array.isArray(m) &&
			m[0] >= 1 &&
			m[0] <= 12 &&
			m[1] >= 1 &&
			m[1] <= 12 &&
			m[0] <= m[1]
		) {
			if (m[1] === 12) {
				return `CAST(date AS DATETIME) BETWEEN '${y}-${m[0]}-1' AND '${
					y + 1
				}-1-1'`;
			}
			return `CAST(date AS DATETIME) BETWEEN '${y}-${m[0]}-1' AND '${y}-${
				m[1] + 1
			}-1'`;
		} else if (!Array.isArray(m) && m >= 12) {
			return `CAST(date AS DATETIME) BETWEEN '${y}-12-1' AND '${y + 1}-1-1'`;
		} else if (!Array.isArray(m) && m >= 1) {
			return `CAST(date AS DATETIME) BETWEEN '${y}-${m}-1' AND '${y}-${
				m + 1
			}-1'`;
		}
	},
	uuid({
		uuid,
		originUUID,
	}: Partial<Record<"uuid" | "originUUID", string | null>>) {
		const queries = [];
		if (uuid) {
			queries.push(`uuid = "${uuid}"`);
		}
		if (originUUID) {
			queries.push(`originUUID = "${originUUID}"`);
		}
		return queries.join(" ");
	},
} as const;

export default Filter;

type Filter = typeof Filter;
type Options = {
	[K in keyof Filter]?:
		| (Parameters<Filter[K]>["length"] extends 1
				? Parameters<Filter[K]>[number]
				: Parameters<Filter[K]>)
		| null;
};
export function helper(options: Options) {
	const queries = [];

	// 时间筛选
	if (options.year && options.month) {
		const year =
			typeof options.year === "string" ? parseInt(options.year) : options.year;
		queries.push(Filter.month(year, options.month[1]));
	} else if (options.year && !options.month) {
		queries.push(Filter.year(options.year));
	} else if (!options.year && options.month) {
		queries.push(Filter.month(...options.month));
	}

	// uuid 筛选
	if (options.uuid) {
		queries.push(Filter.uuid(options.uuid));
	}

	return `WHERE ${queries.join(" ")};`;
}
