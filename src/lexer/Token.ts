export enum TokenType {
  Keyword,
  Identifier,
  Semicolon,
  EOF,
}

export interface Token {
  type: TokenType;
  value: string;
}