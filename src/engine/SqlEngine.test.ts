import { expect, test } from "bun:test";
import { Database } from "../storage/Database";
import { Table } from "../storage/Table";
import { SqlEngine } from "./SqlEngine";

test("consumes SQL statements", () => {
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
      ],
    ),
  );

  const engine = SqlEngine.start(db);

  engine.consume("INSERT INTO users VALUES (2, 'Bob', 20);");

  const result = engine.consume("SELECT * FROM users;");

  expect(result).toEqual([
    {
      id: 1,
      name: "Alice",
      age: 30,
    },
    {
      id: 2,
      name: "Bob",
      age: 20,
    },
  ]);
});
