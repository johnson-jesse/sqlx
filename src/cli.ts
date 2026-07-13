import { Lexer } from "./lexer/Lexer";

const sql = "SELECT users FROM accounts;";

const lexer = new Lexer(sql);

console.log(lexer.tokenize());