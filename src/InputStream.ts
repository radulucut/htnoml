export function InputStream(input: string): InputStream {
  let pos = 0, line = 1, col = 0;

  function next(): string {
    const char = input.charAt(pos);

    if (char === '\n') {
      line++;
      col = 0;
    } else {
      col++;
    }

    pos++;

    return char;
  }

  function peek(): string {
    return input.charAt(pos);
  }

  return { next, peek };
}

export interface InputStream {
  next: () => string;
  peek: () => string;
}
