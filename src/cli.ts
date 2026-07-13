import { Lexer } from "./lexer/Lexer";

const sql = `
SELECT id, name
FROM users;
`;

const lexer = new Lexer(sql);

console.log(lexer.tokenize());