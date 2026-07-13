import { TokenType, type Token } from "../lexer/Token";
import type { InsertStatement, SelectStatement, Statement } from "./AST";

export class Parser {
  private position = 0;

  constructor(private tokens: Token[]) {}

  parse(): Statement {
    const token = this.current();

    if (token.type !== TokenType.Keyword) {
      throw new Error("Expected statement");
    }

    switch (token.value) {
      case "SELECT":
        return this.parseSelect();

      case "INSERT":
        return this.parseInsert();

      default:
        throw new Error(`Unknown statement ${token.value}`);
    }
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

  private parseInsert(): InsertStatement {
    this.expectKeyword("INSERT");
    this.expectKeyword("INTO");

    const table = this.expectIdentifier();

    this.expectKeyword("VALUES");
    this.expect(TokenType.LeftParen);

    const values = this.parseValues();

    this.expect(TokenType.RightParen);

    return {
      type: "InsertStatement",
      table,
      values,
    };
  }

  private parseValues(): (string | number)[] {
    const values: (string | number)[] = [];

    values.push(this.parseLiteral());

    while (this.current().type === TokenType.Comma) {
      this.position++; // consume comma
      values.push(this.parseLiteral());
    }

    return values;
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
    const token = this.expect(TokenType.Keyword);

    if (token.value !== keyword) {
      throw new Error(`Expected ${keyword}, got ${token.value}`);
    }
  }

  private expectIdentifier(): string {
    return this.expect(TokenType.Identifier).value;
  }

  private expect(type: TokenType): Token {
    const token = this.current();

    if (token.type !== type) {
      throw new Error(
        `Expected ${TokenType[type]}, got ${TokenType[token.type]}`,
      );
    }

    this.position++;

    return token;
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

  private parseLiteral(): string | number {
    const token = this.current();

    switch (token.type) {
      case TokenType.Number:
        this.position++;
        return Number(token.value);

      case TokenType.String:
        this.position++;
        return token.value;

      default:
        throw new Error(`Expected literal, got ${token.value}`);
    }
  }

  private parseExpression() {
    const left = this.expectIdentifier();

    const operator = this.current();

    if (operator.type !== TokenType.Operator) {
      throw new Error(`Expected operator, got ${operator.value}`);
    }

    this.position++;

    return {
      type: "BinaryExpression" as const,
      left,
      operator: operator.value,
      right: this.parseLiteral(),
    };
  }
}
