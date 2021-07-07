import ElementNode from '../src/ElementNode';
import TextNode from '../src/TextNode';
import { parse } from '../src/Parser';

test('parse htnoml', () => {
  const htnoml = `
{:html
	{:body 
		{class[container main] > This is HTnoML syntax}
	}
}`;
  
  const container = new ElementNode();
  container.attributes.push({
    name: 'class',
    value: 'container main',
  });

  const textNode = new TextNode();
  textNode.text =' This is HTnoML syntax';
  container.childNodes.push(textNode);
  
  const body = new ElementNode();
  body.childNodes.push(container);
  body.nodeTypes.push('body');
  
  const html = new ElementNode();
  html.childNodes.push(body);
  html.nodeTypes.push('html');

  const expectedTree = new ElementNode(true);
  expectedTree.childNodes.push(html);

  const htmlTree = parse(htnoml);

  expect(htmlTree).toEqual(expectedTree);
});

