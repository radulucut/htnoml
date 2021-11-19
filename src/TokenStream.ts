import { InputStream } from "./InputStream";

export function TokenStream(inputStream: InputStream): TokenStream {
  let currentToken: Token = null;

  function isWhiteSpace(char: string): boolean {
    return ' \t\n\r'.indexOf(char) >= 0;
  }

  function isReservedChar(char: string): boolean {
    return ':>{}[]'.indexOf(char) >= 0;
  }

  function isIdentifier(char: string): boolean {
    return !isReservedChar(char) && !isWhiteSpace(char);
  }

  function readWhile(predicate: (char: string) => boolean): string {
    let str = '';

    while (inputStream.peek() !== '' && predicate(inputStream.peek())) {
      str = str + inputStream.next();
    }

    return str;
  }

  function readNext(): Token | null {
    const char = inputStream.peek();
    
    if (char === '')
      return null;

    if (isWhiteSpace(char))
      return { type: TokenType.Whitespace, value: readWhile(isWhiteSpace) };

    if (isReservedChar(char))
      return { type: TokenType.ReservedChar, value: inputStream.next() };

    return { type: TokenType.Identifier, value: readWhile(isIdentifier) }
  }

  function next(): Token {
    const token = currentToken;
    currentToken = null;

    return token || readNext();
  }

  function peek(): Token {
    if (currentToken === null)
      currentToken = readNext();

    return currentToken;
  }

  return { next, peek };
}

export interface TokenStream {
  next: () => Token | null;
  peek: () => Token | null;
}

export interface Token {
  type: TokenType;
  value: string;
}

export const enum TokenType {
  Whitespace = 1,
  Identifier = 2,
  ReservedChar = 3,
}
