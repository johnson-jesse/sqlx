import { SqlEngine } from "./SqlEngine";
import { Database } from "./storage/Database";
import { Table } from "./storage/Table";

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

const sql = "SELECT * FROM users WHERE age > 14;";
console.log(SqlEngine.start(db).read(sql));
