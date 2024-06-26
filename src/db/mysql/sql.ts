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
			{ name: "currency", option: "VARCHAR(50) NOT NULL" },
			{ name: "amount", option: "VARCHAR(50) NOT NULL" },
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
export type TableFields<T extends TableName> =
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
