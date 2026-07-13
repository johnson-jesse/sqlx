import { describe, expect, test } from "bun:test";
import { Lexer } from "./Lexer";
import { TokenType } from "./Token";
import { expectToken } from "./test-utils";

describe("Lexer", () => {
  test("tokenizes a simple SELECT statement", () => {
    const sql = "SELECT users;";
    const lexer = new Lexer(sql);
    const tokens = lexer.tokenize();

    expectToken(tokens[0], TokenType.Keyword, "SELECT");
    expectToken(tokens[1], TokenType.Identifier, "users");
    expectToken(tokens[2], TokenType.Semicolon, ";");
    expectToken(tokens[3], TokenType.EOF, "");
  });

  test("tokenizes SELECT FROM statement", () => {
    const sql = "SELECT users FROM accounts;";

    const lexer = new Lexer(sql);
    const tokens = lexer.tokenize();

    expectToken(tokens[0], TokenType.Keyword, "SELECT");
    expectToken(tokens[1], TokenType.Identifier, "users");
    expectToken(tokens[2], TokenType.Keyword, "FROM");
    expectToken(tokens[3], TokenType.Identifier, "accounts");
    expectToken(tokens[4], TokenType.Semicolon, ";");
    expectToken(tokens[5], TokenType.EOF, "");
  });

  test("tokenizes SELECT * FROM statement", () => {
    const sql = "SELECT * FROM users;";

    const lexer = new Lexer(sql);
    const tokens = lexer.tokenize();

    expectToken(tokens[0], TokenType.Keyword, "SELECT");
    expectToken(tokens[1], TokenType.Asterisk, "*");
    expectToken(tokens[2], TokenType.Keyword, "FROM");
    expectToken(tokens[3], TokenType.Identifier, "users");
    expectToken(tokens[4], TokenType.Semicolon, ";");
    expectToken(tokens[5], TokenType.EOF, "");
  });
});
