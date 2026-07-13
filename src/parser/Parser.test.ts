import { test, expect, describe } from "bun:test";
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
});
