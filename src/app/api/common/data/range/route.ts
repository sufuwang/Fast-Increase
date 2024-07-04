import mysql from "@/db/mysql";
import { TableNames } from "@/db/mysql/sql";

export const GET = async () => {
	const res = await Promise.allSettled(
		TableNames.map((name) =>
			mysql.query(`SELECT DISTINCT SUBSTRING(date, 1, 4) FROM ${name}`)
		)
	);

	return Response.json(
		[
			...new Set(
				res
					.map(({ value }: any) => value[0])
					.flat(Infinity)
					.map((row) => row["SUBSTRING(date, 1, 4)"])
			),
		].sort((a, b) => a - b)
	);
};
