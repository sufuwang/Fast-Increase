import { createContext, Dispatch, SetStateAction } from "react";
import { Bills, Assets } from "./const";
import dayjs, { Dayjs } from "dayjs";
import type { DefaultOptionType } from "antd/lib/cascader";
import {
	LatentAssetsFieldType,
	LatentAssetsId,
	AccountFieldType,
	AccountId,
	DebtId,
	DebtFieldType,
	IncomeFieldType,
	IncomeId,
	OutcomeFieldType,
	OutcomeId,
} from "./_comps/Bills";
import { AccountTypes, IncomeTypes, OutcomeTypes, Properties } from "./const";

type Item<T> = Array<T & { id: string }>;
interface BillsContextItem {
	[AccountId]: Item<AccountFieldType>;
	[DebtId]: Item<DebtFieldType>;
	[IncomeId]: Item<IncomeFieldType>;
	[OutcomeId]: Item<OutcomeFieldType>;
}
interface AssetsContextItem {
	[LatentAssetsId]: Item<LatentAssetsFieldType>;
}
export type Context = Partial<BillsContextItem & AssetsContextItem>;

export const Context = createContext<{
	context: Context;
	setContext: Dispatch<SetStateAction<Context>>;
}>({
	context: {},
	setContext: () => void 0,
});

export const getTodayDate = (format?: dayjs.OptionType) => {
	const date = new Date();
	return dayjs(
		`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
		format ?? ["YYYY/M/D", "YYYY/MM/DD", "YYYY/M/DD", "YYYY/MM/D"]
	);
};

export const getUUID = () => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export const getTypeLabelWithoutOptions = (
	values: string | string[],
	mark?: string
) => {
	return (
		getTypeLabel(IncomeTypes, values, mark) ||
		getTypeLabel(OutcomeTypes, values, mark) ||
		getTypeLabel(Properties, values, mark) ||
		getTypeLabel(AccountTypes, values, mark)
	);
};
export const getTypeLabel = (
	options: DefaultOptionType[],
	values: string | string[],
	mark: string = "-",
	str = ""
): string => {
	if (!Array.isArray(values)) {
		values = [values];
	}
	if (options.length === 0) {
		return str;
	}
	const [value, ...restValues] = values;
	const item = options.find((o) => o.value === value);
	if (!item) {
		return str;
	}
	return getTypeLabel(
		item.children ?? [],
		restValues,
		mark,
		str ? `${str}${mark}${item.label}` : `${item.label}`
	);
};

export const getBillLabel = (id: string): string => {
	return [...Bills, ...Assets].find((item) => item.id === id)?.label ?? "-";
};

export const handleDate = (value: unknown | unknown[], format?: string) => {
	const vs = Array.isArray(value) ? value : [value];
	return vs.map((v) => ({
		...v,
		date: (v.date as Dayjs).format(format ?? "YYYY-MM-DD"),
	}));
};
