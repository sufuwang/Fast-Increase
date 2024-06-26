import React, { useContext } from "react";
import { Cascader, Form, Input, Button, DatePicker, List } from "antd";
import {
	Context,
	getTodayDate,
	getTypeLabel,
	getUUID,
	handleDate,
} from "../../tools";
import { Properties } from "../../const";
import AmountFormItem from "../Amount";
import type { Dayjs } from "dayjs";

export interface LatentAssetsFieldType {
	id: string;
	date: Dayjs;
	type: string[];
	currency: string;
	amount: string;
	comment?: string;
}
type LatentAssetsDBType = DBType<LatentAssetsFieldType>;

export default function LatentAssets() {
	const [form] = Form.useForm();
	const { context, setContext } = useContext(Context);

	const onChange = (_: unknown, values: LatentAssetsFieldType) => {
		if (values.type.includes("stock")) {
			form.setFieldValue("currency", "StockCount");
		} else if (values.type.includes("hkDollar")) {
			form.setFieldValue("currency", "HK");
		}
	};
	const onFinish = (value: LatentAssetsFieldType) => {
		setContext({
			...context,
			LatentAssetsBill: [
				...(context.LatentAssetsBill ?? []),
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
			labelCol={{ span: 3 }}
			initialValues={{
				date: getTodayDate(),
				type: [Properties[0].value, Properties[0].children![0].value],
				currency: "RMB",
				amount: 0,
			}}
			onFinish={onFinish}
			onValuesChange={onChange}
		>
			<Form.Item<LatentAssetsFieldType>
				label="日期"
				name="date"
				rules={[{ required: true }]}
			>
				<DatePicker className="!w-[30%]" placeholder="" />
			</Form.Item>

			<Form.Item<LatentAssetsFieldType>
				label="类型"
				name="type"
				rules={[{ required: true }]}
			>
				<Cascader className="!w-[30%]" options={Properties} />
			</Form.Item>

			<AmountFormItem
				setOptions={(options) =>
					options.filter((c) => !["StockCount"].includes(c.value))
				}
			/>

			<Form.Item<LatentAssetsFieldType> label="备注" name="comment">
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

export const LatentAssetsId = "LatentAssetsBill" as const;
export const LatentAssetsRender = (value: LatentAssetsFieldType) => {
	return (
		<List.Item.Meta
			title={`${value.date.format("YYYY-MM-DD")} / ${getTypeLabel(
				Properties,
				value.type
			)} / ${value.currency}-${value.amount}`}
			description={value.comment}
		/>
	);
};
export const getLatentAssetString = (value: LatentAssetsDBType) => {
	return [
		getTypeLabel(Properties, value.type.split("-")),
		`${value.currency}-${value.amount}`,
		`${value.comment}`,
	]
		.filter((d) => d.length > 0)
		.join(" / ");
};
export const LatentAssetsHandlers = {
	async GET(): Promise<LatentAssetsDBType[]> {
		const d = await fetch("/api/latentAssets");
		return d.json();
	},
	async POST(value: LatentAssetsFieldType[]) {
		fetch("/api/latentAssets", {
			method: "POST",
			body: JSON.stringify(handleDate(value)),
		});
	},
};
