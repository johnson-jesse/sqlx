import type { BinaryExpression } from "../parser/AST";

export class ExpressionEvaluator {
  evaluate(
    expression: BinaryExpression,
    row: Record<string, unknown>
  ): boolean {
    const left = row[expression.left];

    if (
      typeof left !== "number" &&
      typeof left !== "string"
    ) {
      throw new Error(
        `Cannot compare value: ${String(left)}`
      );
    }

    switch (expression.operator) {
      case ">":
        return left > expression.right;

      case "<":
        return left < expression.right;

      case "=":
        return left === expression.right;

      default:
        throw new Error(
          `Unknown operator ${expression.operator}`
        );
    }
  }
}