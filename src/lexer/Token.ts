// export enum TokenType {
//   Keyword,
//   Identifier,
//   Semicolon,
//   Asterisk,
//   Number,
//   String,
//   Operator,
//   EOF,
// }

export enum TokenType {
  Keyword,
  Identifier,
  Semicolon,
  Asterisk,

  Number,
  String,

  Operator,

  LeftParen,
  RightParen,
  Comma,

  EOF,
}

export interface Token {
  type: TokenType;
  value: string;
}

export const keywords = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "DELETE",
]);
