import { describe, expect, test } from "bun:test";
import { Lexer } from "../lexer/Lexer";
import { Parser } from "./Parser";

describe("Parser", () => {
  test("parses SELECT * FROM users", () => {
    const sql = "SELECT * FROM users;";

    const lexer = new Lexer(sql);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast).toEqual({
      type: "SelectStatement",
      columns: ["*"],
      table: "users",
    });
  });

  test("parses SELECT with WHERE", () => {
    const sql = "SELECT * FROM users WHERE age > 18;";

    const lexer = new Lexer(sql);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast).toEqual({
      type: "SelectStatement",
      columns: ["*"],
      table: "users",
      where: {
        type: "BinaryExpression",
        left: "age",
        operator: ">",
        right: 18,
      },
    });
  });

  test("parses INSERT statement", () => {
    const sql = "INSERT INTO users VALUES (3, 'Charlie', 25);";

    const tokens = new Lexer(sql).tokenize();

    const ast = new Parser(tokens).parse();

    expect(ast).toEqual({
      type: "InsertStatement",
      table: "users",
      values: [3, "Charlie", 25],
    });
  });

  test("parses SELECT with multiple columns", () => {
    const sql = "SELECT id, name FROM users;";

    const tokens = new Lexer(sql).tokenize();
    const ast = new Parser(tokens).parse();

    expect(ast).toEqual({
      type: "SelectStatement",
      columns: ["id", "name"],
      table: "users",
    });
  });

  test("parses CREATE TABLE statement", () => {
    const sql = "CREATE TABLE users (id, name, age);";

    const tokens = new Lexer(sql).tokenize();
    const ast = new Parser(tokens).parse();

    expect(ast).toEqual({
      type: "CreateTableStatement",
      table: "users",
      columns: ["id", "name", "age"],
    });
  });

  test("parses UPDATE statement", () => {
    const sql = "UPDATE users SET age = 31 WHERE name = 'Alice';";

    const tokens = new Lexer(sql).tokenize();

    const ast = new Parser(tokens).parse();

    expect(ast).toEqual({
      type: "UpdateStatement",
      table: "users",
      assignments: [
        {
          column: "age",
          value: 31,
        },
      ],
      where: {
        type: "BinaryExpression",
        left: "name",
        operator: "=",
        right: "Alice",
      },
    });
  });
});
