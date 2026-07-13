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

  test("tokenizes numbers", () => {
    const sql = "123";

    const lexer = new Lexer(sql);
    const tokens = lexer.tokenize();

    expectToken(tokens[0], TokenType.Number, "123");
    expectToken(tokens[1], TokenType.EOF, "");
  });

  test("tokenizes greater than operator", () => {
    const sql = "age > 18";

    const lexer = new Lexer(sql);
    const tokens = lexer.tokenize();

    expectToken(tokens[0], TokenType.Identifier, "age");
    expectToken(tokens[1], TokenType.Operator, ">");
    expectToken(tokens[2], TokenType.Number, "18");
    expectToken(tokens[3], TokenType.EOF, "");
  });

  test("tokenizes SELECT WHERE query", () => {
    const sql = "SELECT * FROM users WHERE age > 18;";

    const lexer = new Lexer(sql);
    const tokens = lexer.tokenize();

    expectToken(tokens[0], TokenType.Keyword, "SELECT");
    expectToken(tokens[1], TokenType.Asterisk, "*");
    expectToken(tokens[2], TokenType.Keyword, "FROM");
    expectToken(tokens[3], TokenType.Identifier, "users");
    expectToken(tokens[4], TokenType.Keyword, "WHERE");
    expectToken(tokens[5], TokenType.Identifier, "age");
    expectToken(tokens[6], TokenType.Operator, ">");
    expectToken(tokens[7], TokenType.Number, "18");
    expectToken(tokens[8], TokenType.Semicolon, ";");
    expectToken(tokens[9], TokenType.EOF, "");
  });
});
