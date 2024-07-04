"use client";
import React, { useEffect, useState } from "react";
import type { TableColumnsType } from "antd";
import { Spin, Table } from "antd";
import ExpendedTable from "./_comps/ExpendedTable";
import type { TableFields } from "@/db/mysql/sql";
import { getLatentAssetString } from "./update/_comps/Bills/LatentAssets";

export interface DataType {
	key: React.Key;
	total: number;
	date: string;
	income: string;
	outcome: string;
	balance: string;
	balanceChange: string;
	debt: string;
	debtChange: string;
}

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

const App: React.FC = () => {
	const curYear = new Date().getFullYear();
	const [yearRange, setYearRange] = useState<number[]>([curYear]);
	const [columns, setColumns] = useState<TableColumnsType<DataType>>([]);
	const [initialize, setInitialize] = useState(true);
	const [tableData, setTableData] = useState<DataType[]>([]);
	const [data, setData] = useState<Record<string, DataItem[]>>({});

	const getData = async (year = curYear) => {
		const uu = (
			(await (await fetch("/api/latentAssets")).json()) as Array<any>
		).flat(Infinity);
		const d = (
			await Promise.all(
				(
					await Promise.all(Urls.map(({ url }) => fetch(`${url}?year=${year}`)))
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
					const key = row.date.split("-").slice(0, 2).join("-");
					return row;
				})
			)
			.map((data, index) => ({ data, label: Urls[index].label }));
		setData(
			Object.assign(data, {
				[year]: d,
			})
		);
	};
	const getTableData = () => {
		const rows = Object.values(data)
			.flat(1)
			.map(({ data }) => data)
			.flat(Infinity);

		const dataSource: DataType[] = [];
		yearRange.forEach((year) => {
			for (let i = 1; i <= 12; ++i) {
				const date = `${year}-${i.toString().padStart(2, "0")}`;
				const rowsOfCurYear = rows.filter((item: any) =>
					item.date.startsWith(date)
				);
				const total = rowsOfCurYear.length;

				if (total > 0) {
					dataSource.push(
						Object.assign({
							key: date,
							total: total,
							date,
							income: "0",
							outcome: "0",
							balance: "0",
							balanceChange: "0",
							debt: "0",
							debtChange: "0",
						})
					);
				}
			}
		});
		setTableData(dataSource);
	};
	const getColumns = async () => {
		const filters = (
			(await (await fetch("/api/common/data/range")).json()) as Array<number>
		).map((year: number) => ({ text: year, value: year }));
		setColumns([
			{
				title: "时间",
				dataIndex: "date",
				key: "date",
				filters,
				defaultFilteredValue: [curYear.toString()],
				filterResetToDefaultFilteredValue: true,
			},
			{ title: "数据量", dataIndex: "total", key: "total" },
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
		]);
	};

	useEffect(() => {
		Promise.allSettled([getData(), getColumns()]).then(() => {
			getTableData();
			setInitialize(false);
		});
	}, []);
	useEffect(() => {
		Promise.allSettled(yearRange.map(getData)).then(() => {
			getTableData();
		});
	}, [yearRange]);

	if (initialize || columns.length === 0) {
		return <Spin />;
	}

	return (
		<>
			<Table
				size="middle"
				columns={columns}
				expandable={{
					expandedRowRender: (props) =>
						ExpendedTable(props, yearRange.map((year) => data[year]).flat(1)),
				}}
				pagination={false}
				dataSource={tableData}
				onChange={(_, filters) => {
					setYearRange(
						((filters.date as number[]) || [curYear]).sort((a, b) => a - b)
					);
				}}
			/>
		</>
	);
};

export default App;
