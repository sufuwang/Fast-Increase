import mysql from "mysql2/promise";
import { TablesName, create, insert } from "./sql";

export default class Mysql {
  private static connection?: mysql.Connection;

  constructor() {}

  private static async create() {
    if (!Mysql.connection) {
      Mysql.connection = await mysql.createConnection({
        host: "192.168.131.97",
        user: "root",
        password: "123456",
        database: "assets_sheet",
      });
    }
    return Mysql.connection;
  }

  static async query(str: string) {
    const connection = await this.create();
    return connection.query(str);
  }
  static async register() {
    const [_tables] = (await Mysql.query("show tables")) as any[];
    const tables = _tables.map((table: any) => table["Tables_in_assets_sheet"]);
    TablesName.filter((t) => !tables.includes(t)).forEach((k) =>
      Mysql.query(create(k)),
    );
  }
}

Mysql.register();
