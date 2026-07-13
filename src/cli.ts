import { SqlEngine } from "./engine/SqlEngine";
import { Database } from "./storage/Database";

const db = new Database();

const engine = SqlEngine.start(db);
engine.consume(
  "CREATE TABLE users (id, name, age);"
);

engine.consume(
  "INSERT INTO users VALUES (1, 'Alice', 30);"
);

engine.consume(
  "INSERT INTO users VALUES (1, 'Jesse', 49);"
);

const users = engine.consume(
  "SELECT * FROM users;"
);

console.log(users);