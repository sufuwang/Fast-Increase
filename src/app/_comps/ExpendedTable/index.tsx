import React from "react";
import type { TableColumnsType } from "antd";
import { Table } from "antd";
import type { DataType, DataItem } from "../../page";
import { getTypeLabelWithoutOptions } from "../../update/tools";

export interface ExpandedDataType {
	key: React.Key;
	kind: string;
	date: string;
	type: string;
	amount: string;
	origin: string;
	comment: string;
}
const columns: TableColumnsType<ExpandedDataType> = [
	{ title: "", dataIndex: "kind", key: "kind" },
	{ title: "登记时间", dataIndex: "date", key: "date" },
	{ title: "类型", dataIndex: "type", key: "type" },
	{ title: "金额", dataIndex: "amount", key: "amount" },
	{ title: "缘由", dataIndex: "originDesc", key: "originDesc" },
	{ title: "备注", dataIndex: "comment", key: "comment" },
];

export default function ExpandedTable(props: DataType, data: DataItem[] = []) {
	const [year, month] = props.date.split("-");

	const dataSource: ExpandedDataType[] = data
		.map((item) => {
			return item.data
				.filter((row) => row.date.startsWith(`${year}-${month}`))
				.map((row: any) => {
					return {
						...row,
						key: row.uuid,
						kind: item.label,
						date: row.date,
						type:
							(row.type
								? getTypeLabelWithoutOptions(row.type.split("-"))
								: undefined) ?? "-",
						amount: row.amount,
						originDesc: row.originDesc || "-",
						comment: row.comment || "-",
					};
				});
		})
		.flat(Infinity);

	return (
		<Table
			size="small"
			columns={columns}
			dataSource={dataSource}
			pagination={false}
		/>
	);
}
