import { Executor } from "./executor/Executor";
import { Lexer } from "./lexer/Lexer";
import { Parser } from "./parser/Parser";
import type { Database } from "./storage/Database";

export class SqlEngine {
  private constructor(private db: Database) {}

  public static start(db: Database) {
    return new SqlEngine(db);
  }

  read(sql: string) {
    const lexer = new Lexer(sql);
    const tokens = lexer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();
    const executor = new Executor(this.db);
    
    return executor.execute(ast);
  }
}
