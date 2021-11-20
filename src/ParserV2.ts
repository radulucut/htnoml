import { TokenStream, Token, TokenType } from './TokenStream';

export function Parser(tokenStream: TokenStream): any {
  function parse() {
    const childParentMap = new Map();
    const root: Root = { type: NodeType.Root, childNodes: [] };
    let node: (Root | Element | Text) = root;

    while (tokenStream.peek() !== null) {
      const token = tokenStream.next();

      if (token.type === TokenType.Whitespace)
        continue;

      if (token.type === TokenType.ReservedChar && token.value === ':') {
        (node as Element).elementType = tokenStream.next().value;
      }

      if (token.type === TokenType.Identifier) {
        const attribute: Attribute = {
          name: token.value,
          value: ''
        };

        readAttribute(attribute);

        (node as Element).attributes.push(attribute);
      }

      if (token.type === TokenType.ReservedChar && token.value === '{') { // TODO: maybe we can have an enum type for this?
        const element: Element = { type: NodeType.Element, elementType: 'div', attributes: [], childNodes: [] };

        (node as (Element | Root)).childNodes.push(element);

        childParentMap.set(element, node);
        node = element;

        continue;
      }

      if (token.type === TokenType.ReservedChar && token.value === '}') {
        node = childParentMap.get(node);
      }

      if (token.type === TokenType.ReservedChar && token.value === '>') {
        const textNode: Text = { type: NodeType.Text, text: '' };
        readText(textNode);

        (node as Element).childNodes.push(textNode);

        continue;
      }
    } 

    return root;
  }

  function readAttribute(attribute: Attribute) {
    let token = tokenStream.peek();

    if (token.type === TokenType.ReservedChar && token.value === '[') {
      tokenStream.next();
      token = tokenStream.next();

      while(token !== null && !(token.type === TokenType.ReservedChar && token.value === ']')) {
        attribute.value += token.value;
        token = tokenStream.next();
      }
    }
  }

  function readText(textNode: Text) {
    let token = tokenStream.peek();
    let text = '';

    while (token !== null && !(token.type === TokenType.ReservedChar && token.value === '}')) {
      text += tokenStream.next().value;

      token = tokenStream.peek();
    }

    textNode.text = text;
  }

  return { parse };
}

interface Node {
  type: NodeType;
}

interface Root extends Node {
  childNodes: (Element | Text)[]; // TODO: use linked list?
}

interface Element extends Node {
  elementType: string;
  attributes: Attribute[];
  childNodes: (Element | Text)[]; // TODO: use linked list?
}

interface Text extends Node {
  text: string;
}

interface Attribute {
  name: string;
  value: string;
}

const enum NodeType {
  Root = 1,
    Element = 2,
    Text = 3,
}
