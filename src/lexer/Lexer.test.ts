import { describe, test } from "bun:test";
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

  test("tokenizes string literal", () => {
    const lexer = new Lexer("'Alice'");

    const tokens = lexer.tokenize();

    expectToken(tokens[0], TokenType.String, "Alice");
    expectToken(tokens[1], TokenType.EOF, "");
  });

  test("tokenizes WHERE with string", () => {
    const lexer = new Lexer("SELECT * FROM users WHERE name = 'Alice';");

    const tokens = lexer.tokenize();

    expectToken(tokens[0], TokenType.Keyword, "SELECT");
    expectToken(tokens[1], TokenType.Asterisk, "*");
    expectToken(tokens[2], TokenType.Keyword, "FROM");
    expectToken(tokens[3], TokenType.Identifier, "users");
    expectToken(tokens[4], TokenType.Keyword, "WHERE");
    expectToken(tokens[5], TokenType.Identifier, "name");
    expectToken(tokens[6], TokenType.Operator, "=");
    expectToken(tokens[7], TokenType.String, "Alice");
  });

  test("tokenizes INSERT statement", () => {
    const lexer = new Lexer("INSERT INTO users VALUES (3, 'Charlie', 25);");

    const tokens = lexer.tokenize();

    expectToken(tokens[0], TokenType.Keyword, "INSERT");
    expectToken(tokens[1], TokenType.Keyword, "INTO");
    expectToken(tokens[2], TokenType.Identifier, "users");
    expectToken(tokens[3], TokenType.Keyword, "VALUES");
    expectToken(tokens[4], TokenType.LeftParen, "(");
    expectToken(tokens[5], TokenType.Number, "3");
    expectToken(tokens[6], TokenType.Comma, ",");
    expectToken(tokens[7], TokenType.String, "Charlie");
    expectToken(tokens[8], TokenType.Comma, ",");
    expectToken(tokens[9], TokenType.Number, "25");
    expectToken(tokens[10], TokenType.RightParen, ")");
    expectToken(tokens[11], TokenType.Semicolon, ";");
  });
});
