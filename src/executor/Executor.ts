import type { SelectStatement } from "../parser/AST";
import { ExpressionEvaluator } from "../runtime/ExpressionEvaluator";
import { Database } from "../storage/Database";

export class Executor {
  private expressionEvaluator = new ExpressionEvaluator();

  constructor(private db: Database) {}

  execute(statement: SelectStatement) {
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
}
