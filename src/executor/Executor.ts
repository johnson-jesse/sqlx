import type {
  CreateTableStatement,
  DeleteStatement,
  InsertStatement,
  SelectStatement,
  Statement,
  UpdateStatement,
} from "../parser/AST";
import { ExpressionEvaluator } from "../runtime/ExpressionEvaluator";
import { Database } from "../storage/Database";
import { Table } from "../storage/Table";

export class Executor {
  private expressionEvaluator = new ExpressionEvaluator();

  constructor(private db: Database) {}

  execute(statement: Statement) {
    switch (statement.type) {
      case "SelectStatement":
        return this.executeSelect(statement);

      case "InsertStatement":
        return this.executeInsert(statement);

      case "CreateTableStatement":
        return this.executeCreateTable(statement);

      case "UpdateStatement":
        return this.executeUpdate(statement);

      case "DeleteStatement":
        return this.executeDelete(statement);

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

  private executeCreateTable(statement: CreateTableStatement) {
    this.db.addTable(new Table(statement.table, statement.columns, []));

    return {
      success: true,
    };
  }

  private executeUpdate(statement: UpdateStatement) {
    const table = this.db.getTable(statement.table);

    let updated = 0;

    for (const row of table.rows) {
      if (
        statement.where &&
        !this.expressionEvaluator.evaluate(statement.where, row)
      ) {
        continue;
      }

      for (const assignment of statement.assignments) {
        row[assignment.column] = assignment.value;
      }

      updated++;
    }

    return {
      updated,
    };
  }

  private executeDelete(statement: DeleteStatement) {
    const table = this.db.getTable(statement.table);

    const originalCount = table.rows.length;

    if (!statement.where) {
      table.rows = [];
    } else {
      table.rows = table.rows.filter(
        (row) => !this.expressionEvaluator.evaluate(statement.where!, row),
      );
    }

    return {
      deleted: originalCount - table.rows.length,
    };
  }
}
