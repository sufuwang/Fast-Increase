import React, { useContext, useState } from "react";
import type { FormProps } from "antd";
import {
	Button,
	Segmented,
	Form,
	Input,
	DatePicker,
	Cascader,
	List,
} from "antd";
import AmountFormItem from "../Amount";
import { Currencies, IncomeTypes } from "../../const";
import {
	Context,
	getTodayDate,
	getTypeLabel,
	getUUID,
	handleDate,
} from "../../tools";
import OriginSelect from "../OriginSelect";

export type IncomeFieldType = {
	id: string;
	measurable: boolean;
	originUUID?: string;
	type: string[];
	currency?: string;
	amount?: string;
	date: string;
	comment?: string;
};
type IncomeDBType = DBType<IncomeFieldType, "type">;

export default function Income() {
	const [form] = Form.useForm();
	const [measurable, setMeasurable] = useState(true);
	const { context, setContext } = useContext(Context);

	const onValuesChange: FormProps<IncomeFieldType>["onValuesChange"] = (
		_,
		values
	) => {
		setMeasurable(values.measurable);
	};
	const onFinish: FormProps<IncomeFieldType>["onFinish"] = (value) => {
		setContext({
			...context,
			IncomeBill: [
				...(context.IncomeBill ?? []),
				Object.assign(value, {
					id: getUUID(),
					type: Array.isArray(value.type) ? value.type : [value.type],
					...(value.measurable ? {} : { currency: "", amount: "" }),
				}),
			],
		});
		form.resetFields();
		setMeasurable(true);
	};

	return (
		<Form
			form={form}
			initialValues={{
				measurable: true,
				date: getTodayDate(),
				currency: Currencies[0].value,
				type: IncomeTypes[0].value,
				amount: 0,
			}}
			labelCol={{ span: 3 }}
			onValuesChange={onValuesChange}
			onFinish={onFinish}
		>
			<Form.Item<IncomeFieldType>
				label="状态"
				name="measurable"
				rules={[{ required: true }]}
			>
				<Segmented<{ label: string; value: boolean }>
					options={[
						{ label: "可量化", value: true },
						{ label: "不可量化", value: false },
					]}
				/>
			</Form.Item>

			<Form.Item<IncomeFieldType>
				label="日期"
				name="date"
				rules={[{ required: true }]}
			>
				<DatePicker className="!w-[30%]" placeholder="" />
			</Form.Item>

			<Form.Item<IncomeFieldType>
				label="类型"
				name="type"
				rules={[{ required: true }]}
			>
				<Cascader className="!w-[30%]" options={IncomeTypes} />
			</Form.Item>

			<AmountFormItem disabled={!measurable} />

			<Form.Item<IncomeFieldType> label="缘由" name="originUUID">
				<OriginSelect />
			</Form.Item>

			<Form.Item<IncomeFieldType> label="备注" name="comment">
				<Input.TextArea placeholder="请填写收入备注" />
			</Form.Item>

			<Form.Item className="flex justify-end !mb-0">
				<Button type="primary" htmlType="submit">
					确认
				</Button>
			</Form.Item>
		</Form>
	);
}

export const IncomeId = "IncomeBill" as const;
export const IncomeRender = (value: IncomeDBType) => {
	return (
		<List.Item.Meta
			title={`${value.date.format("YYYY-MM-DD")} / ${getTypeLabel(
				IncomeTypes,
				value.type
			)} / ${value.currency}-${value.amount}`}
			description={value.comment}
		/>
	);
};
export const IncomeHandlers = {
	async POST(value: IncomeFieldType[]) {
		fetch("/api/bill/income", {
			method: "POST",
			body: JSON.stringify(handleDate(value)),
		});
	},
};
