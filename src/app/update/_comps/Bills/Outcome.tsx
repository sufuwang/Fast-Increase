import React, { useContext } from "react";
import type { FormProps } from "antd";
import { List } from "antd";
import { Button, Form, Input, DatePicker, Cascader } from "antd";
import AmountFormItem from "../Amount";
import { Currencies, OutcomeTypes } from "../../const";
import {
	Context,
	getTodayDate,
	getTypeLabel,
	getUUID,
	handleDate,
} from "../../tools";
import OriginSelect from "../OriginSelect";

export type OutcomeFieldType = {
	id: string;
	originUUID?: string;
	type: string[];
	currency: string;
	amount: string;
	date: string;
	comment?: string;
};
type OutcomeDBType = DBType<OutcomeFieldType, "type">;

export default function Outcome() {
	const [form] = Form.useForm();
	const { context, setContext } = useContext(Context);

	const onFinish: FormProps<OutcomeDBType>["onFinish"] = (value) => {
		setContext({
			...context,
			OutcomeBill: [
				...(context.OutcomeBill ?? []),
				Object.assign(value, {
					id: getUUID(),
					type: Array.isArray(value.type) ? value.type : [value.type],
					amount: parseFloat(value.amount),
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
				currency: Currencies[0].value,
				type: OutcomeTypes[0].value,
				amount: 0,
			}}
			labelCol={{ span: 3 }}
			onFinish={onFinish}
		>
			<Form.Item<OutcomeFieldType>
				label="日期"
				name="date"
				rules={[{ required: true }]}
			>
				<DatePicker className="!w-[30%]" placeholder="" />
			</Form.Item>

			<Form.Item<OutcomeFieldType>
				label="类型"
				name="type"
				rules={[{ required: true }]}
			>
				<Cascader className="!w-[30%]" options={OutcomeTypes} />
			</Form.Item>

			<AmountFormItem />

			<Form.Item<OutcomeFieldType> label="缘由" name="originUUID">
				<OriginSelect />
			</Form.Item>

			<Form.Item<OutcomeFieldType> label="备注" name="comment">
				<Input.TextArea placeholder="请填写支出备注" />
			</Form.Item>

			<Form.Item className="flex justify-end !mb-0">
				<Button type="primary" htmlType="submit">
					确认
				</Button>
			</Form.Item>
		</Form>
	);
}

export const OutcomeId = "OutcomeBill" as const;
export const OutcomeRender = (value: OutcomeDBType) => {
	return (
		<List.Item.Meta
			title={`${value.date.format("YYYY-MM-DD")} / ${getTypeLabel(
				OutcomeTypes,
				value.type
			)} / ${value.currency}-${value.amount}`}
			description={value.comment}
		/>
	);
};
export const OutcomeHandlers = {
	async POST(value: OutcomeFieldType[]) {
		fetch("/api/bill/outcome", {
			method: "POST",
			body: JSON.stringify(handleDate(value)),
		});
	},
};
