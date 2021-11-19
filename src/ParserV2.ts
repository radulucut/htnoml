import { TokenStream, Token, TokenType } from './TokenStream';

export function Parser(tokenStream: TokenStream): any {
  function parse() {
    const root: Node = { type: NodeType.Root, children: [] };
    let node: Node = root;

    while (tokenStream.peek() !== null) {
      const token = tokenStream.next();
      console.log('parse: ', token);

      if (token.type === TokenType.Whitespace)
        continue;

      if (token.type === TokenType.ReservedChar && token.value === '{') { // TODO: maybe we can have an enum type for this?
        const newNode: Node = { type: NodeType.Element, children: [] };

        node.children.push(newNode);
        node = newNode;

        continue;
      }

      if (token.type === TokenType.ReservedChar && token.value === '>') {
        const textNode: Node = { type: NodeType.Text, children: [] };
        readTextNode(textNode);

        node.children.push(textNode);

        continue;
      }

      node.children.push(token);
    } 

    return root;
  }

  function readTextNode(node: Node) {
    let token = tokenStream.next();

    while (token !== null) {
      if (token.type === TokenType.ReservedChar && token.value === '}')
        return node; 

      node.children.push(token);

      token = tokenStream.next();
    }
  }

  return { parse };
}

interface Node {
  type: NodeType;
  children: (Node | Token)[]; // TODO: use linked list?
}

const enum NodeType {
  Root = 1,
  Element = 2,
  Text = 3,
}
