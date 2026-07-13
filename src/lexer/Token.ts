export enum TokenType {
  Keyword,
  Identifier,
  Semicolon,
  Asterisk,
  EOF,
}

export interface Token {
  type: TokenType;
  value: string;
}

export const keywords = new Set([
  "SELECT",
  "FROM",
]);