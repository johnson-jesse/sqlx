import { Table } from "./Table";

export class Database {
  private tables = new Map<string, Table>();

  addTable(table: Table) {
    this.tables.set(table.name, table);
  }

  getTable(name: string): Table {
    const table = this.tables.get(name);

    if (!table) {
      throw new Error(`Table ${name} does not exist`);
    }

    return table;
  }
}
