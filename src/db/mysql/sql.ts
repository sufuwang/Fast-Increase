export const Filter = {
	year(y: number | string) {
		return Filter.month(parseInt(y.toString()), [1, 12]);
	},
	month(y: number, m: [number, number] | number) {
		if (
			Array.isArray(m) &&
			m[0] >= 1 &&
			m[0] <= 12 &&
			m[1] >= 1 &&
			m[1] <= 12 &&
			m[0] <= m[1]
		) {
			if (m[1] === 12) {
				return `WHERE CAST(date AS DATETIME) BETWEEN '${y}-${m[0]}-1' AND '${
					y + 1
				}-1-1';`;
			}
			return `WHERE CAST(date AS DATETIME) BETWEEN '${y}-${m[0]}-1' AND '${y}-${
				m[1] + 1
			}-1';`;
		} else if (!Array.isArray(m) && m >= 12) {
			return `WHERE CAST(date AS DATETIME) BETWEEN '${y}-12-1' AND '${
				y + 1
			}-1-1';`;
		} else if (!Array.isArray(m) && m >= 1) {
			return `WHERE CAST(date AS DATETIME) BETWEEN '${y}-${m}-1' AND '${y}-${
				m + 1
			}-1';`;
		}
	},
} as const;

const Config = {
	assets: {
		table_name: "assets",
		fields: [
			{ name: "id", option: "INT PRIMARY KEY AUTO_INCREMENT" },
			{ name: "uuid", option: "VARCHAR(50) UNIQUE NOT NULL" },
			{ name: "date", option: "VARCHAR(20) NOT NULL" },
			{ name: "type", option: "VARCHAR(100) NOT NULL" },
			{ name: "currency", option: "VARCHAR(50) NOT NULL" },
			{ name: "amount", option: "VARCHAR(50) NOT NULL" },
			{ name: "comment", option: "VARCHAR(200)" },
		],
	},
	income: {
		table_name: "income",
		fields: [
			{ name: "id", option: "INT PRIMARY KEY AUTO_INCREMENT" },
			{ name: "uuid", option: "VARCHAR(50) UNIQUE NOT NULL" },
			{ name: "date", option: "VARCHAR(20) NOT NULL" },
			{ name: "type", option: "VARCHAR(100) NOT NULL" },
			{ name: "originUUID", option: "VARCHAR(50)" },
			{ name: "currency", option: "VARCHAR(50) NOT NULL" },
			{ name: "amount", option: "VARCHAR(50) NOT NULL" },
			{ name: "comment", option: "VARCHAR(200)" },
		],
	},
	outcome: {
		table_name: "outcome",
		fields: [
			{ name: "id", option: "INT PRIMARY KEY AUTO_INCREMENT" },
			{ name: "uuid", option: "VARCHAR(50) UNIQUE NOT NULL" },
			{ name: "date", option: "VARCHAR(20) NOT NULL" },
			{ name: "type", option: "VARCHAR(100) NOT NULL" },
			{ name: "originUUID", option: "VARCHAR(50)" },
			{ name: "currency", option: "VARCHAR(50) NOT NULL" },
			{ name: "amount", option: "VARCHAR(50) NOT NULL" },
			{ name: "comment", option: "VARCHAR(200)" },
		],
	},
	account: {
		table_name: "account",
		fields: [
			{ name: "id", option: "INT PRIMARY KEY AUTO_INCREMENT" },
			{ name: "uuid", option: "VARCHAR(50) UNIQUE NOT NULL" },
			{ name: "date", option: "VARCHAR(20) NOT NULL" },
			{ name: "alipay_currency", option: "VARCHAR(50) NOT NULL" },
			{ name: "alipay_amount", option: "VARCHAR(50) NOT NULL" },
			{ name: "wechat_currency", option: "VARCHAR(50) NOT NULL" },
			{ name: "wechat_amount", option: "VARCHAR(50) NOT NULL" },
			{ name: "mainland_bank_currency", option: "VARCHAR(50) NOT NULL" },
			{ name: "mainland_bank_amount", option: "VARCHAR(50) NOT NULL" },
			{ name: "hk_bank_currency", option: "VARCHAR(50) NOT NULL" },
			{ name: "hk_bank_amount", option: "VARCHAR(50) NOT NULL" },
			{ name: "comment", option: "VARCHAR(200)" },
		],
	},
	debt: {
		table_name: "debt",
		fields: [
			{ name: "id", option: "INT PRIMARY KEY AUTO_INCREMENT" },
			{ name: "uuid", option: "VARCHAR(50) UNIQUE NOT NULL" },
			{ name: "date", option: "VARCHAR(20) NOT NULL" },
			{ name: "originUUID", option: "VARCHAR(50)" },
			{ name: "currency", option: "VARCHAR(50) NOT NULL" },
			{ name: "amount", option: "VARCHAR(50) NOT NULL" },
			{ name: "comment", option: "VARCHAR(200)" },
		],
	},
} as const;

type TableName = keyof typeof Config;
type TableFields<T extends TableName> =
	(typeof Config)[T]["fields"][number]["name"];
type TableFieldsWithoutId<T extends TableName> = Exclude<TableFields<T>, "id">;

export const TablesName = Object.keys(Config) as TableName[];

export const create = (table_name: TableName) => {
	const config = Config[table_name];
	return `CREATE TABLE ${config.table_name} (
    ${config.fields.map((field) => `${field.name} ${field.option}`).join(", ")}
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
};
export const insert = <T extends TableName>(
	table_name: T,
	data: Record<TableFieldsWithoutId<T>, string>
) => {
	const fields = Object.keys(data).join(", ");
	const values = Object.values(data)
		.map((i) => `"${i}"`)
		.join(", ");
	return `INSERT INTO ${table_name} (${fields}) VALUES (${values})`;
};
export const read = (table_name: TableName, filter?: string | null) => {
	const s = `SELECT * FROM ${table_name}`;
	return filter ? `${s} ${filter}` : s;
};
