import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "S",
	description: "A app can record asset and debt",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-hans">
			<body className={inter.className}>
				<AntdRegistry>{children}</AntdRegistry>
			</body>
		</html>
	);
}
