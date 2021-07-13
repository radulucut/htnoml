import ElementNode from '../src/ElementNode';
import TextNode from '../src/TextNode';

describe('ElementNode', () => {
  describe('toHtml', () => {
    test('should return valid html', () => {
      const textNode = new TextNode();
      textNode.text =' This is HTnoML syntax';

      const container = new ElementNode();
      container.childNodes.push(textNode);
      container.attributes.push({
        name: 'class',
        value: 'container main',
      });

      const body = new ElementNode();
      body.childNodes.push(container);
      body.nodeTypes.push('body');

      const meta = new ElementNode();
      meta.nodeTypes.push('meta');
      meta.attributes = [
        {
          name: 'name',
          value: 'description'
        },
        {
          name: 'content',
          value: 'This is a HTML5 template'
        }
      ];

      const html = new ElementNode();
      html.childNodes.push(meta);
      html.childNodes.push(body);
      html.nodeTypes.push('html');

      const htmlTree = new ElementNode(true);
      htmlTree.childNodes.push(html);

      const expectedHtml = '<html><meta name="description" content="This is a HTML5 template" /><body><div class="container main"> This is HTnoML syntax</div></body></html>';

      expect(htmlTree.toHtml()).toEqual(expectedHtml);
    });
  });
});
