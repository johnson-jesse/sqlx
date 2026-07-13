import { expect, test } from "bun:test";
import { Lexer } from "../lexer/Lexer";
import { Parser } from "../parser/Parser";
import { Database } from "../storage/Database";
import { Table } from "../storage/Table";
import { Executor } from "./Executor";

test("executes SELECT with WHERE", () => {
  const db = new Database();

  db.addTable(
    new Table("users", [
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
    ]),
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
