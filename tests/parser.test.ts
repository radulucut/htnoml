import { parse, ElementNode, TextNode } from '../src/parser';

test('parse htnoml', () => {
  const htnoml = `
{:html
	{:body 
		{class[container main] > This is HTnoML syntax}
	}
}`;
  
  const container = createElementNode();
  container.attributes.push({
    name: 'class',
    value: 'container main',
  });

  const text = createTextNode(' This is HTnoML syntax');
  container.childNodes.push(text);
  
  const body = createElementNode();
  body.childNodes.push(container);
  body.nodeTypes.push('body');
  
  const html = createElementNode();
  html.childNodes.push(body);
  html.nodeTypes.push('html');

  const expectedTree = createElementNode();
  expectedTree.childNodes.push(html);

  const tree = parse(htnoml);

  expect(tree).toEqual(expectedTree);
});

function createElementNode(): ElementNode {
  return {
    type: 1,
    nodeTypes: [],
    childNodes:[],
    attributes: []
  } as ElementNode;
}

function createTextNode(text: string): TextNode {
  return {
    type: 2,
    text
  } as TextNode;
}
