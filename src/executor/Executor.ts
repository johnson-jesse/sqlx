import type {
  InsertStatement,
  SelectStatement,
  Statement,
} from "../parser/AST";
import { ExpressionEvaluator } from "../runtime/ExpressionEvaluator";
import { Database } from "../storage/Database";

export class Executor {
  private expressionEvaluator = new ExpressionEvaluator();

  constructor(private db: Database) {}

  execute(statement: Statement) {
    switch (statement.type) {
      case "SelectStatement":
        return this.executeSelect(statement);

      case "InsertStatement":
        return this.executeInsert(statement);

      default:
        throw new Error(`Unsupported statement`);
    }
  }

  private executeSelect(statement: SelectStatement) {
    const table = this.db.getTable(statement.table);

    let rows = table.rows;

    if (statement.where) {
      rows = rows.filter((row) =>
        this.expressionEvaluator.evaluate(statement.where!, row),
      );
    }

    if (statement.columns.length === 1 && statement.columns[0] === "*") {
      return rows;
    }

    return rows.map((row) => {
      const result: Record<string, unknown> = {};

      for (const column of statement.columns) {
        result[column] = row[column];
      }

      return result;
    });
  }

  private executeInsert(statement: InsertStatement) {
    const table = this.db.getTable(statement.table);

    if (statement.values.length !== table.columns.length) {
      throw new Error("Number of values does not match number of columns");
    }

    const row: Record<string, unknown> = {};

    table.columns.forEach((column, index) => {
      row[column] = statement.values[index];
    });

    table.rows.push(row);

    return row;
  }
}
