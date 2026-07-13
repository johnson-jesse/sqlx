import { SqlEngine } from "./engine/SqlEngine";
import { Database } from "./storage/Database";

const db = new Database();

const engine = SqlEngine.start(db);
engine.consume("CREATE TABLE users (id, name, age);");

engine.consume("INSERT INTO users VALUES (1, 'Cheyenne', 29);");
engine.consume("INSERT INTO users VALUES (2, 'Alice', 17);");
engine.consume("INSERT INTO users VALUES (3, 'Jesse', 49);");

const users = engine.consume("SELECT * FROM users;");

console.log(users);

// console.log(engine.consume("UPDATE users SET name = 'Alicia', age = 32 WHERE id = 1;"));
// console.log(engine.consume("SELECT * FROM users;"));

console.log(engine.consume(
  "DELETE FROM users WHERE age < 18;"
));

console.log(
  engine.consume("SELECT * FROM users;")
);