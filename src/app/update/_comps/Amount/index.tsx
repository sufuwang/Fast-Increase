import { Form, InputNumber, Select, Space } from "antd";
import { Currencies } from "../../const";

const { Option } = Select;

interface Props {
	label?: string;
	disabled?: boolean;
	namePrefix?: string;
	setOptions?:
		| ((options: typeof Currencies) => typeof Currencies)
		| typeof Currencies;
}

const getName = (name: string, namePrefix?: string) => {
	return namePrefix ? [namePrefix, name] : name;
};

export default function Amount({
	label,
	disabled,
	namePrefix,
	setOptions = Currencies,
}: Props) {
	return (
		<Form.Item
			label={label ? label : "金额"}
			name={getName("amount", namePrefix)}
			rules={[{ required: true }]}
		>
			<Space.Compact className="!w-[60%]">
				<Form.Item name={getName("currency", namePrefix)} noStyle>
					<Select disabled={disabled} className="!w-[50%]">
						{(Array.isArray(setOptions)
							? setOptions
							: typeof setOptions === "function"
							? setOptions(Currencies)
							: Currencies
						).map((currency) => (
							<Option key={currency.value} value={currency.value}>
								{currency.label}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item name={getName("amount", namePrefix)} noStyle>
					<InputNumber min={0} disabled={disabled} className="!w-[50%]" />
				</Form.Item>
			</Space.Compact>
		</Form.Item>
	);
}
