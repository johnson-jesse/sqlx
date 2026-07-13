import { describe, expect, test } from "bun:test";
import { SqlEngine } from "../engine/SqlEngine";
import { Lexer } from "../lexer/Lexer";
import { Parser } from "../parser/Parser";
import { Database } from "../storage/Database";
import { Table } from "../storage/Table";
import { Executor } from "./Executor";

describe("Executor", () => {
  test("executes SELECT with WHERE", () => {
    const db = new Database();

    db.addTable(
      new Table(
        "users",
        ["id", "name", "age"],
        [
          {
            id: 1,
            name: "Alice",
            age: 30,
          },
          {
            id: 2,
            name: "Bob",
            age: 15,
          },
        ],
      ),
    );

    const sql = "SELECT * FROM users WHERE age > 18;";

    const tokens = new Lexer(sql).tokenize();
    const ast = new Parser(tokens).parse();

    const result = new Executor(db).execute(ast);

    expect(result).toEqual([
      {
        id: 1,
        name: "Alice",
        age: 30,
      },
    ]);
  });

  test("selects specific columns", () => {
    const db = new Database();

    db.addTable(
      new Table(
        "users",
        ["id", "name", "age"],
        [
          {
            id: 1,
            name: "Alice",
            age: 30,
          },
          {
            id: 2,
            name: "Bob",
            age: 15,
          },
        ],
      ),
    );

    const sql = "SELECT name, age FROM users;";

    const tokens = new Lexer(sql).tokenize();
    const ast = new Parser(tokens).parse();

    const result = new Executor(db).execute(ast);

    expect(result).toEqual([
      {
        name: "Alice",
        age: 30,
      },
      {
        name: "Bob",
        age: 15,
      },
    ]);
  });

  test("updates matching rows", () => {
    const db = new Database();

    db.addTable(
      new Table(
        "users",
        ["id", "name", "age"],
        [
          {
            id: 1,
            name: "Alice",
            age: 30,
          },
          {
            id: 2,
            name: "Bob",
            age: 15,
          },
        ],
      ),
    );

    const engine = SqlEngine.start(db);

    engine.consume("UPDATE users SET age = 31 WHERE name = 'Alice';");

    const result = engine.consume("SELECT * FROM users;");

    expect(result).toEqual([
      {
        id: 1,
        name: "Alice",
        age: 31,
      },
      {
        id: 2,
        name: "Bob",
        age: 15,
      },
    ]);
  });

  test("deletes matching rows", () => {
    const db = new Database();

    db.addTable(
      new Table(
        "users",
        ["id", "name", "age"],
        [
          {
            id: 1,
            name: "Alice",
            age: 30,
          },
          {
            id: 2,
            name: "Bob",
            age: 15,
          },
        ],
      ),
    );

    const engine = SqlEngine.start(db);

    const result = engine.consume("DELETE FROM users WHERE age < 18;");

    expect(result).toEqual({
      deleted: 1,
    });

    expect(engine.consume("SELECT * FROM users;")).toEqual([
      {
        id: 1,
        name: "Alice",
        age: 30,
      },
    ]);
  });
});
