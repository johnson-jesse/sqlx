import { SqlEngine } from "./runtime/SqlEngine";
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

const engine = SqlEngine.start(db)
engine.read("INSERT INTO users VALUES (3, 'Charlie', 25);")
console.log(engine.read("SELECT * FROM users WHERE age > 14;"));
