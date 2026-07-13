import { Executor } from "../executor/Executor";
import { Lexer } from "../lexer/Lexer";
import { Parser } from "../parser/Parser";
import type { Database } from "../storage/Database";

export class SqlEngine {
  private constructor(private executor: Executor) {}

  static start(db: Database) {
    return new SqlEngine(new Executor(db));
  }

  consume(sql: string) {
    const lexer = new Lexer(sql);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const statement = parser.parse();

    return this.executor.execute(statement);
  }
}
