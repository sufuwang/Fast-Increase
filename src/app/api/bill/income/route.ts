import type { IncomeFieldType } from "@/app/update/_comps/Bills";
import mysql from "@/db/mysql";
import { insert, read } from "@/db/mysql/sql";
import { helper } from "@/db/mysql/filter";
import { NextRequest } from "next/server";

export const GET = async (r: NextRequest) => {
	const params = r.nextUrl.searchParams;
	const year = params.get("year");
	const month = params.get("month");
	const [data] = await mysql.query(
		read(
			"income",
			year
				? month
					? helper({ month: [parseInt(year), parseInt(month)] })
					: helper({ year })
				: null
		)
	);
	return Response.json(data);
};

export const POST = async (request: Request) => {
	const data: CoverDateToString<IncomeFieldType>[] = await request.json();

	await mysql.register();
	await Promise.all(
		data.map((item) => {
			return mysql.query(
				insert("income", {
					uuid: item.id,
					type: item.type.join("-"),
					date: item.date,
					originUUID: item.originUUID ?? "",
					currency: item.currency ?? "",
					amount: item.amount ?? "",
					comment: item.comment ?? "",
				})
			);
		})
	);

	return Response.json(1);
};
