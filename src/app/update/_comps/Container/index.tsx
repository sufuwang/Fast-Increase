"use client";
import { useState } from "react";
import { Context } from "../../tools";
import Actions from "../Actions";
import BillComps from "../Bills";
import { Card, Col, Row } from "antd";
import type { Item } from "../../const";
import List from "../List";

interface Props {
	list: readonly Item[];
}

export default function Container({ list }: Props) {
	const [context, setContext] = useState<Context>({});

	return (
		<Context.Provider value={{ context, setContext }}>
			<div className="w-[100vw] h-[100vh] p-2 overflow-hidden flex flex-row">
				<div className="flex-auto mr-[10px]">
					<List />
				</div>
				<div className="w-[64%] overflow-scroll">
					<Row>
						{list.map((item) => {
							const Comp = BillComps.find((Comp) => Comp.id === item.id)?.comp;
							if (!Comp) {
								return;
							}
							return (
								<Col key={item.id} span={12}>
									<Card
										style={{
											width: "100%",
											height: "100%",
											marginBottom: "12px",
										}}
										title={item.label}
									>
										<Comp />
									</Card>
								</Col>
							);
						})}
					</Row>
				</div>
				<Actions />
			</div>
		</Context.Provider>
	);
}
