import { Lexer } from "./lexer/Lexer";
import { Parser } from "./parser/Parser";
import { Database } from "./storage/Database";
import { Table } from "./storage/Table";

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

const lexer = new Lexer(sql);
const tokens = lexer.tokenize();

const parser = new Parser(tokens);
const ast = parser.parse();

console.log(JSON.stringify(ast, null, 2));
