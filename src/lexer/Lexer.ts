import { keywords, TokenType, type Token } from "./Token";

export class Lexer {
  private position = 0;

  constructor(private input: string) {}

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.position < this.input.length) {
      const char = this.input[this.position];

      if (char === undefined) break;

      // Ignore whitespace
      if (/\s/.test(char)) {
        this.position++;
        continue;
      }

      // Words
      if (/[a-zA-Z_]/.test(char)) {
        tokens.push(this.readWord());
        continue;
      }

      // Numbers
      if (/[0-9]/.test(char)) {
        tokens.push(this.readNumber());
        continue;
      }

      // Semicolon
      if (char === ";") {
        tokens.push({
          type: TokenType.Semicolon,
          value: ";",
        });

        this.position++;
        continue;
      }

      // Asterisk
      if (char === "*") {
        tokens.push({
          type: TokenType.Asterisk,
          value: "*",
        });

        this.position++;
        continue;
      }

      // Operators
      if (["=", ">", "<"].includes(char)) {
        tokens.push({
          type: TokenType.Operator,
          value: char,
        });

        this.position++;
        continue;
      }

      throw new Error(`Unexpected character: ${char}`);
    }

    tokens.push({
      type: TokenType.EOF,
      value: "",
    });

    return tokens;
  }

  private readWord(): Token {
    let word = "";

    while (this.position < this.input.length) {
      const char = this.input[this.position];

      if (!char || !/[a-zA-Z_]/.test(char)) {
        break;
      }

      word += char;
      this.position++;
    }

    const upper = word.toUpperCase();

    if (keywords.has(upper)) {
      return {
        type: TokenType.Keyword,
        value: upper,
      };
    }

    return {
      type: TokenType.Identifier,
      value: word,
    };
  }

  private readNumber(): Token {
    let number = "";

    while (this.position < this.input.length) {
      const char = this.input[this.position];
      if (!char || !/[0-9]/.test(char)) break;

      number += char;
      this.position++;
    }

    return {
      type: TokenType.Number,
      value: number,
    };
  }
}
