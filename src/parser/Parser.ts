import { TokenType, type Token } from "../lexer/Token";
import type { SelectStatement } from "./AST";

export class Parser {
  private position = 0;

  constructor(private tokens: Token[]) {}

  parse(): SelectStatement {
    return this.parseSelect();
  }

  private parseSelect(): SelectStatement {
    this.expectKeyword("SELECT");

    const columns = this.parseColumns();

    this.expectKeyword("FROM");

    const table = this.expectIdentifier();

    let where;

    if (
      this.current().type === TokenType.Keyword &&
      this.current().value === "WHERE"
    ) {
      this.position++;
      where = this.parseExpression();
    }

    return {
      type: "SelectStatement",
      columns,
      table,
      where,
    };
  }

  private parseColumns(): string[] {
    const columns: string[] = [];

    if (this.current().type === TokenType.Asterisk) {
      columns.push("*");
      this.position++;
      return columns;
    }

    while (this.current().type === TokenType.Identifier) {
      columns.push(this.current().value);
      this.position++;
    }

    return columns;
  }

  private expectKeyword(keyword: string) {
    const token = this.current();

    if (token.type !== TokenType.Keyword || token.value !== keyword) {
      throw new Error(`Expected ${keyword}, got ${token.value}`);
    }

    this.position++;
  }

  private expectIdentifier(): string {
    const token = this.current();

    if (token.type !== TokenType.Identifier) {
      throw new Error(`Expected identifier, got ${token.value}`);
    }

    this.position++;

    return token.value;
  }

  private current(): Token {
    return this.peek(0);
  }

  private peek(offset: number): Token {
    const token = this.tokens[this.position + offset];

    if (!token) {
      throw new Error("Unexpected end of input");
    }

    return token;
  }

  private parseExpression() {
    const left = this.expectIdentifier();

    const operator = this.current();

    if (operator.type !== TokenType.Operator) {
      throw new Error(`Expected operator, got ${operator.value}`);
    }

    this.position++;

    const right = this.current();

    if (right.type !== TokenType.Number) {
      throw new Error(`Expected number, got ${right.value}`);
    }

    this.position++;

    return {
      type: "BinaryExpression" as const,
      left,
      operator: operator.value,
      right: Number(right.value),
    };
  }
}
