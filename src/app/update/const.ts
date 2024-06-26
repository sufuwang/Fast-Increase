import { LatentAssetsId } from "./_comps/Bills/LatentAssets";
import { DebtId } from "./_comps/Bills/Debt";
import { IncomeId } from "./_comps/Bills/Income";
import { OutcomeId } from "./_comps/Bills/Outcome";
import { AccountId } from "./_comps/Bills/Account";
import type { DefaultOptionType } from "antd/lib/cascader";

export const Assets = [
	{
		id: LatentAssetsId,
		label: "潜在资产清单",
	},
] as const;
export const Bills = [
	{
		id: IncomeId,
		label: "收入清单",
	},
	{
		id: OutcomeId,
		label: "支出清单",
	},
	{
		id: AccountId,
		label: "账户清单",
	},
	{
		id: DebtId,
		label: "债务清单",
	},
] as const;
export type Item = (typeof Assets)[number] | (typeof Bills)[number];

export const Properties: DefaultOptionType[] = [
	{
		value: "immovableProperty",
		label: "不动产",
		children: [
			{ value: "house", label: "房屋" },
			{ value: "car", label: "汽车" },
		],
	},
	{
		value: "investment",
		label: "投资",
		children: [
			{ value: "stock", label: "股票" },
			{ value: "fund", label: "基金" },
			{
				value: "forex",
				label: "外汇",
				children: [{ value: "hkDollar", label: "港币" }],
			},
		],
	},
];

export const AccountTypes = [
	{ value: "alipay", label: "支付宝" },
	{ value: "wechat", label: "微信" },
	{ value: "rmb", label: "人民币" },
	{ value: "hk-dollar", label: "港币" },
];

export const IncomeTypes = [
	{ value: "wage", label: "工资" },
	{ value: "partTime", label: "兼职" },
	{ value: "lever", label: "杠杆" },
	...Properties,
].sort((a, b) => (a.children ?? []).length - (b.children ?? []).length);

export const OutcomeTypes = [
	{
		value: "live",
		label: "生活支出",
		children: [{ value: "travel", label: "旅游" }],
	},
	{ value: "lever", label: "杠杆支出" },
	...Properties,
].sort((a, b) => (a.children ?? []).length - (b.children ?? []).length);

export const Currencies = [
	{ label: "人民币", value: "RMB" },
	{ label: "港币", value: "HK" },
	{ label: "股票数量", value: "StockCount" },
];
