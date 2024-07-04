import React, { useContext } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, DatePicker, List } from "antd";
import AmountFormItem from "../Amount";
import {
	Context,
	getTodayDate,
	getTypeLabel,
	getUUID,
	handleDate,
} from "../../tools";
import { AccountTypes } from "../../const";

export type AccountFieldType = {
	id: string;
	date: string;
	comment?: string;
	item: {
		currency: string;
		amount: string;
	};
};
type AccountDBType = DBType<AccountFieldType, "item">;

export default function Account() {
	const [form] = Form.useForm();
	const { context, setContext } = useContext(Context);

	const onFinish: FormProps<AccountFieldType>["onFinish"] = (value) => {
		setContext({
			...context,
			AccountBill: [
				...(context.AccountBill ?? []),
				Object.assign(value, {
					id: getUUID(),
					item: Object.assign(value.item, {
						amount: parseFloat(value.item.amount),
					}),
				}),
			],
		});
		form.resetFields();
	};

	return (
		<Form
			form={form}
			initialValues={{
				date: getTodayDate(),
				item: {
					currency: AccountTypes[0].value,
					amount: 0,
				},
			}}
			labelCol={{ span: 4 }}
			onFinish={onFinish}
		>
			<Form.Item<AccountFieldType>
				label="日期"
				name="date"
				rules={[{ required: true }]}
			>
				<DatePicker className="!w-[34%]" placeholder="" />
			</Form.Item>

			<AmountFormItem
				namePrefix="item"
				label="项目"
				setOptions={AccountTypes}
			/>

			<Form.Item<AccountFieldType> label="备注" name="comment">
				<Input.TextArea placeholder="请填写备注" />
			</Form.Item>

			<Form.Item className="flex justify-end !mb-0">
				<Button type="primary" htmlType="submit">
					确认
				</Button>
			</Form.Item>
		</Form>
	);
}

export const AccountId = "AccountBill" as const;
export const AccountRender = (value: AccountDBType) => {
	return (
		<List.Item.Meta
			title={`${value.date.format("YYYY-MM-DD")} / ${getTypeLabel(
				AccountTypes,
				value.item.currency
			)}-${value.item.amount}`}
			description={value.comment}
		/>
	);
};
export const AccountHandlers = {
	async POST(value: AccountFieldType[]) {
		fetch("/api/bill/account", {
			method: "POST",
			body: JSON.stringify(handleDate(value)),
		});
	},
};
