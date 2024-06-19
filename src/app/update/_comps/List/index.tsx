import { useContext } from "react";
import { Context, getBillLabel } from "../../tools";
import BillComps from "../Bills";
import { Empty, List as _List } from "antd";

interface Props {}
export default function List({}: Props) {
	const { context, setContext } = useContext(Context);

	const onDelete = (billId: string, id: string) => {
		const bill = context[billId as keyof Context] ?? [];
		setContext({ ...context, [billId]: bill.filter((item) => item.id !== id) });
	};

	const data = Object.entries(context);

	if (!Array.isArray(data) || data.length === 0) {
		return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
	}
	return data.map(([billId, items]) => {
		const d = BillComps.find((i) => i.id === billId)!;
		return (
			<_List<(typeof items)[number]>
				key={billId}
				header={getBillLabel(billId)}
				bordered
				size="small"
				dataSource={items}
				renderItem={(value) => {
					return (
						<_List.Item
							actions={[
								<a
									key="list-loadmore-edit"
									onClick={() => onDelete(billId, value.id)}
								>
									删除
								</a>,
							]}
						>
							{d.render?.(value as any)}
						</_List.Item>
					);
				}}
			/>
		);
	});
}
