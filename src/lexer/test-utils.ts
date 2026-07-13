import { expect } from "bun:test";
import { TokenType, type Token } from "./Token";

export function expectToken(token: Token | void, type: TokenType, value: string) {
  expect(token).toEqual({
    type,
    value,
  });
}

export function expectTokens(actual: Token[], expected: Token[]) {
  expect(actual).toEqual(expected);
}
