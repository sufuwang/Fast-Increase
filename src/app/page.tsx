"use client";
import React, { useEffect, useState } from "react";
import type { TableColumnsType } from "antd";
import { Table } from "antd";
import ExpendedTable from "./_comps/ExpendedTable";
import type { TableFields } from "@/db/mysql/sql";
import { getLatentAssetString } from "./update/_comps/Bills/LatentAssets";

export interface DataType {
	key: React.Key;
	date: string;
	income: string;
	outcome: string;
	balance: string;
	balanceChange: string;
	debt: string;
	debtChange: string;
}

const columns: TableColumnsType<DataType> = [
	{ title: "时间", dataIndex: "date", key: "date" },
	{ title: "收入总额", dataIndex: "income", key: "income" },
	{ title: "支出总额", dataIndex: "outcome", key: "outcome" },
	{ title: "账户余额", dataIndex: "balance", key: "balance" },
	{
		title: "账户新增总额(较上月)",
		dataIndex: "balanceChange",
		key: "balanceChange",
	},
	{ title: "债务剩余", dataIndex: "debt", key: "debt" },
	{
		title: "债务新增总额(较上月)",
		key: "debtChange",
		dataIndex: "debtChange",
	},
];
const Urls = [
	{ url: "/api/bill/income", label: "收入" },
	{ url: "/api/bill/outcome", label: "支出" },
	{ url: "/api/bill/account", label: "账户" },
	{ url: "/api/bill/debt", label: "债务" },
] as const;

export type DataItem =
	| {
			label: "收入";
			data: Record<TableFields<"income">, string>[];
	  }
	| {
			label: "支出";
			data: Record<TableFields<"outcome">, string>[];
	  }
	| {
			label: "账户";
			data: Record<TableFields<"account">, string>[];
	  }
	| {
			label: "债务";
			data: Record<TableFields<"debt">, string>[];
	  };

const dataSource: DataType[] = [];
for (let i = 0; i < 3; ++i) {
	const key = i.toString();
	dataSource.push({
		key,
		date: "2024-0" + `${4 + i}`,
		income: key,
		outcome: key,
		balance: key,
		balanceChange: key,
		debt: key,
		debtChange: key,
	});
}

const App: React.FC = () => {
	const [data, setData] = useState<Record<string, DataItem[]>>({});

	const getData = async () => {
		const uu = (
			(await (await fetch("/api/latentAssets")).json()) as Array<any>
		).flat(Infinity);

		const d = (
			await Promise.all(
				(
					await Promise.all(Urls.map(({ url }) => fetch(`${url}?year=2024`)))
				).map((item) => item.json())
			)
		)
			.filter((data) => data.length > 0)
			.map((data) =>
				data.map((row: any) => {
					const tar = uu.find((r) => r.uuid === row.originUUID);
					if (tar) {
						row.originDesc = getLatentAssetString(tar);
					}
					return row;
				})
			)
			.map((data, index) => ({ data, label: Urls[index].label }));

		setData(
			Object.assign(data, {
				2024: d,
			})
		);
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<>
			<Table
				size="middle"
				columns={columns}
				expandable={{
					expandedRowRender: (props) => ExpendedTable(props, data[2024]),
				}}
				dataSource={dataSource}
			/>
		</>
	);
};

export default App;
