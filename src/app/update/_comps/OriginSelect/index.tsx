import { Select, SelectProps } from "antd";
import { useEffect, useState } from "react";
import {
	LatentAssetsHandlers,
	getLatentAssetString,
} from "../Bills/LatentAssets";

export default function OriginSelect(props: SelectProps) {
	const [list, setList] = useState<SelectProps["options"]>([]);

	useEffect(() => {
		LatentAssetsHandlers.GET().then((data) => {
			const ds = data.map((i) => ({
				label: getLatentAssetString(i),
				value: i.uuid,
			}));
			setList(
				[
					{
						label: "潜在资产",
						options: ds,
					},
				].filter((d) => d.options.length > 0)
			);
		});
	}, []);

	return <Select {...props} options={list} placeholder="请选择债务缘由" />;
}
