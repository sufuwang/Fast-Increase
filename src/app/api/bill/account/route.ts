import type { AccountFieldType } from "@/app/update/_comps/Bills";
import mysql from "@/db/mysql";
import { insert, read, Filter } from "@/db/mysql/sql";
import { NextRequest } from "next/server";

export const GET = async (r: NextRequest) => {
	const params = r.nextUrl.searchParams;
	const year = params.get("year");
	const [data] = await mysql.query(read("account", year && Filter.year(year)));
	return Response.json(data);
};

export const POST = async (request: Request) => {
	const data: CoverDateToString<AccountFieldType>[] = await request.json();

	await mysql.register();
	await Promise.all(
		data.map((item) => {
			return mysql.query(
				insert("account", {
					uuid: item.id,
					date: item.date,
					alipay_currency: item.alipay.currency,
					alipay_amount: item.alipay.amount ?? "",
					wechat_currency: item.wechat.currency,
					wechat_amount: item.wechat.amount ?? "",
					mainland_bank_currency: item.mainlandBank.currency,
					mainland_bank_amount: item.mainlandBank.amount ?? "",
					hk_bank_currency: item.hkBank.currency,
					hk_bank_amount: item.hkBank.amount ?? "",
					comment: item.comment ?? "",
				})
			);
		})
	);

	return Response.json(1);
};
