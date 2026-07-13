import { describe, expect, test } from "bun:test";
import { Lexer } from "./Lexer";
import { TokenType } from "./Token";

describe("Lexer", () => {
  test("tokenizes a simple SELECT statement", () => {
    const sql = "SELECT users;";

    const lexer = new Lexer(sql);

    const tokens = lexer.tokenize();

    expect(tokens).toEqual([
      {
        type: TokenType.Keyword,
        value: "SELECT",
      },
      {
        type: TokenType.Identifier,
        value: "users",
      },
      {
        type: TokenType.Semicolon,
        value: ";",
      },
      {
        type: TokenType.EOF,
        value: "",
      },
    ]);
  });
});