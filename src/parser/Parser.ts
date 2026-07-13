import { TokenType, type Token } from "../lexer/Token";
import type {
  Assignment,
  CreateTableStatement,
  DeleteStatement,
  InsertStatement,
  SelectStatement,
  Statement,
  UpdateStatement,
} from "./AST";
import { TokenStream } from "./TokenStream";

export class Parser {
  private stream: TokenStream;

  constructor(private tokens: Token[]) {
    this.stream = new TokenStream(tokens);
  }

  parse(): Statement {
    const token = this.stream.current();

    if (token.type !== TokenType.Keyword) {
      throw new Error("Expected statement");
    }

    switch (token.value) {
      case "SELECT":
        return this.parseSelect();

      case "INSERT":
        return this.parseInsert();

      case "CREATE":
        return this.parseCreateTable();
      case "UPDATE":
        return this.parseUpdate();
      case "DELETE":
        return this.parseDelete();
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
      this.stream.current().type === TokenType.Keyword &&
      this.stream.current().value === "WHERE"
    ) {
      this.stream.advance();
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

  private parseCreateTable(): CreateTableStatement {
    this.stream.expectKeyword("CREATE");
    this.stream.expectKeyword("TABLE");

    const table = this.stream.expectIdentifier();

    this.stream.expect(TokenType.LeftParen);

    const columns = this.parseIdentifiers();

    this.stream.expect(TokenType.RightParen);

    return {
      type: "CreateTableStatement",
      table,
      columns,
    };
  }

  private parseValues(): (string | number)[] {
    const values: (string | number)[] = [];

    values.push(this.parseLiteral());

    while (this.stream.current().type === TokenType.Comma) {
      this.stream.advance(); // consume comma
      values.push(this.parseLiteral());
    }

    return values;
  }

  private parseColumns(): string[] {
    if (this.stream.current().type === TokenType.Asterisk) {
      this.stream.advance();
      return ["*"];
    }

    const columns: string[] = [];

    columns.push(this.expectIdentifier());

    while (this.stream.current().type === TokenType.Comma) {
      this.stream.advance(); // consume comma
      columns.push(this.expectIdentifier());
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
    const token = this.stream.current();

    if (token.type !== type) {
      throw new Error(
        `Expected ${TokenType[type]}, got ${TokenType[token.type]}`,
      );
    }

    this.stream.advance();

    return token;
  }

  private parseLiteral(): string | number {
    const token = this.stream.current();

    switch (token.type) {
      case TokenType.Number:
        this.stream.advance();
        return Number(token.value);

      case TokenType.String:
        this.stream.advance();
        return token.value;

      default:
        throw new Error(`Expected literal, got ${token.value}`);
    }
  }

  private parseExpression() {
    const left = this.expectIdentifier();

    const operator = this.stream.current();

    if (operator.type !== TokenType.Operator) {
      throw new Error(`Expected operator, got ${operator.value}`);
    }

    this.stream.advance();

    return {
      type: "BinaryExpression" as const,
      left,
      operator: operator.value,
      right: this.parseLiteral(),
    };
  }

  private parseIdentifiers(): string[] {
    const identifiers: string[] = [];

    identifiers.push(this.stream.expectIdentifier());

    while (this.stream.current().type === TokenType.Comma) {
      this.stream.expect(TokenType.Comma);
      identifiers.push(this.stream.expectIdentifier());
    }

    return identifiers;
  }

  private parseUpdate(): UpdateStatement {
    this.stream.expectKeyword("UPDATE");

    const table = this.stream.expectIdentifier();

    this.stream.expectKeyword("SET");

    const assignments = this.parseAssignments();

    let where;

    if (this.stream.current().value === "WHERE") {
      this.stream.expectKeyword("WHERE");
      where = this.parseExpression();
    }

    return {
      type: "UpdateStatement",
      table,
      assignments,
      where,
    };
  }

  private parseAssignments(): Assignment[] {
    const assignments: Assignment[] = [];

    assignments.push(this.parseAssignment());

    while (this.stream.current().type === TokenType.Comma) {
      this.stream.expect(TokenType.Comma);
      assignments.push(this.parseAssignment());
    }

    return assignments;
  }

  private parseAssignment(): Assignment {
    const column = this.stream.expectIdentifier();

    this.stream.expect(TokenType.Operator);

    const value = this.parseLiteral();

    return {
      column,
      value,
    };
  }

  private parseDelete(): DeleteStatement {
    this.stream.expectKeyword("DELETE");
    this.stream.expectKeyword("FROM");

    const table = this.stream.expectIdentifier();

    let where;

    if (this.stream.current().value === "WHERE") {
      this.stream.expectKeyword("WHERE");
      where = this.parseExpression();
    }

    return {
      type: "DeleteStatement",
      table,
      where,
    };
  }
}
