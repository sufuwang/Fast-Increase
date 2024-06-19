import LatentAssets, {
	LatentAssetsId,
	LatentAssetsRender,
	LatentAssetsHandlers,
} from "./LatentAssets";
import Account, { AccountId, AccountRender, AccountHandlers } from "./Account";
import Debt, { DebtId, DebtRender, DebtHandlers } from "./Debt";
import Income, { IncomeId, IncomeHandlers, IncomeRender } from "./Income";
import Outcome, { OutcomeId, OutcomeHandlers, OutcomeRender } from "./Outcome";

export type { LatentAssetsFieldType } from "./LatentAssets";
export type { AccountFieldType } from "./Account";
export type { DebtFieldType } from "./Debt";
export type { IncomeFieldType } from "./Income";
export type { OutcomeFieldType } from "./Outcome";
export { LatentAssetsId, AccountId, DebtId, IncomeId, OutcomeId };

const Bills = [
	{
		id: AccountId,
		comp: Account,
		render: AccountRender,
		handlers: AccountHandlers,
	},
	{
		id: DebtId,
		comp: Debt,
		render: DebtRender,
		handlers: DebtHandlers,
	},
	{
		id: IncomeId,
		comp: Income,
		render: IncomeRender,
		handlers: IncomeHandlers,
	},
	{
		id: OutcomeId,
		comp: Outcome,
		render: OutcomeRender,
		handlers: OutcomeHandlers,
	},
	{
		id: LatentAssetsId,
		comp: LatentAssets,
		render: LatentAssetsRender,
		handlers: LatentAssetsHandlers,
	},
] as const;

export default Bills;
export type Bills = (typeof Bills)[number];
