import React, { useContext } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input, List, DatePicker } from "antd";
import AmountFormItem from "../Amount";
import { Currencies, IncomeTypes } from "../../const";
import { Context, getTodayDate, getUUID, handleDate } from "../../tools";
import OriginSelect from "../OriginSelect";

export type DebtFieldType = {
	id: string;
	originUUID: string;
	date: string;
	currency: string;
	amount: string;
	comment?: string;
};
type DebtDBType = DBType<DebtFieldType, "date">;

export default function Debt() {
	const [form] = Form.useForm();
	const { context, setContext } = useContext(Context);

	const onFinish: FormProps<DebtFieldType>["onFinish"] = (value) => {
		setContext({
			...context,
			DebtBill: [
				...(context.DebtBill ?? []),
				Object.assign(value, { id: getUUID() }),
			],
		});
		form.resetFields();
	};

	return (
		<Form
			form={form}
			initialValues={{
				date: getTodayDate(),
				amount: 0,
				currency: Currencies[0].value,
				type: IncomeTypes[0].value,
			}}
			labelCol={{ span: 3 }}
			onFinish={onFinish}
		>
			<Form.Item<DebtFieldType>
				label="日期"
				name="date"
				rules={[{ required: true }]}
			>
				<DatePicker className="!w-[30%]" placeholder="" />
			</Form.Item>

			<AmountFormItem />

			<Form.Item<DebtFieldType>
				label="缘由"
				name="originUUID"
				rules={[{ required: true }]}
			>
				<OriginSelect />
			</Form.Item>

			<Form.Item<DebtFieldType> label="备注" name="comment">
				<Input.TextArea placeholder="请填写债务备注" />
			</Form.Item>

			<Form.Item className="flex justify-end !mb-0">
				<Button type="primary" htmlType="submit">
					确认
				</Button>
			</Form.Item>
		</Form>
	);
}

export const DebtId = "DebtBill" as const;
export const DebtRender = (value: DebtDBType) => {
	return (
		<List.Item.Meta
			title={`${value.date.format("YYYY-MM-DD")} / ${value.currency}-${
				value.amount
			}`}
			description={value.comment}
		/>
	);
};
export const DebtHandlers = {
	async POST(value: DebtFieldType[]) {
		fetch("/api/bill/debt", {
			method: "POST",
			body: JSON.stringify(handleDate(value)),
		});
	},
};
