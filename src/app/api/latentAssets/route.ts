import type { LatentAssetsFieldType } from "@/app/update/_comps/Bills";
import mysql from "@/db/mysql";
import { insert, read, Filter } from "@/db/mysql/sql";
import { NextRequest } from "next/server";

export const GET = async (r: NextRequest) => {
	const params = r.nextUrl.searchParams;
	const year = params.get("year");
	const [data] = await mysql.query(read("assets", year && Filter.year(year)));
	return Response.json(data);
};

export const POST = async (request: Request) => {
	const data: CoverDateToString<LatentAssetsFieldType>[] = await request.json();

	await mysql.register();
	await Promise.allSettled(
		data.map((item) => {
			return mysql.query(
				insert("assets", {
					uuid: item.id,
					type: item.type.join("-"),
					date: item.date,
					currency: item.currency,
					amount: item.amount,
					comment: item.comment ?? "",
				})
			);
		})
	);

	return Response.json("1");
};
