import { TokenType, type Token } from "../lexer/Token";

export class TokenStream {
  private position = 0;

  constructor(private tokens: Token[]) {}

  current(): Token {
    return this.peek();
  }

  peek(offset = 0): Token {
    const token = this.tokens[this.position + offset];

    if (!token) {
      throw new Error("Unexpected end of input");
    }

    return token;
  }

  advance(): Token {
    const token = this.current();

    this.position++;

    return token;
  }

  expect(type: TokenType): Token {
    const token = this.current();

    if (token.type !== type) {
      throw new Error(
        `Expected ${TokenType[type]}, got ${TokenType[token.type]}`
      );
    }

    this.position++;

    return token;
  }

  expectKeyword(keyword: string): Token {
    const token = this.expect(TokenType.Keyword);

    if (token.value !== keyword) {
      throw new Error(
        `Expected ${keyword}, got ${token.value}`
      );
    }

    return token;
  }

  expectIdentifier(): string {
    return this.expect(TokenType.Identifier).value;
  }
}