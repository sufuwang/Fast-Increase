import { Button, Space } from "antd";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../tools";
import { usePathname, useRouter } from "next/navigation";
import BillComps from "../Bills";

export default function ActionBar() {
	const pathname = usePathname();
	const router = useRouter();
	const { context, setContext } = useContext(Context);
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [showUpdateAssets, setShowUpdateAssets] = useState(false);

	useEffect(() => {
		setShowUpdateAssets(pathname === "/update/bills");
	}, [pathname]);
	useEffect(() => {
		setDisabled(
			!Object.entries(context).find((item) =>
				item && item[1] ? item[1].length > 0 : false
			)
		);
	}, [context]);

	const onClick = async () => {
		setLoading(true);
		try {
			await Promise.all(
				Object.entries(context)
					.filter((item) => Array.isArray(item[1]) && item[1].length > 0)
					.map(([key, data]) => {
						const { handlers } = BillComps.find((i) => i.id === key)!;
						return handlers.POST(data as any);
					})
			);
			setContext({
				...context,
				...Object.fromEntries(
					BillComps.map(({ id }) => id)
						.filter(
							(id) => Array.isArray(context[id]) && context[id]!.length > 0
						)
						.map((key) => [key, []])
				),
			});
		} finally {
			setLoading(false);
			setDisabled(false);
		}
	};

	return (
		<Space className="flex justify-end p-2 m-6 fixed right-0 bottom-0 bg-white">
			{showUpdateAssets ? (
				<Button onClick={() => router.push("/update/assets")}>更新资产</Button>
			) : (
				<Button onClick={() => router.push("/update/bills")}>更新清单</Button>
			)}
			<Button
				type="primary"
				disabled={disabled}
				loading={loading}
				onClick={onClick}
			>
				提交
			</Button>
		</Space>
	);
}
