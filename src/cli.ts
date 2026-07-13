import { Lexer } from "./lexer/Lexer";

const sql = "SELECT users;";

const lexer = new Lexer(sql);

console.log(lexer.tokenize());