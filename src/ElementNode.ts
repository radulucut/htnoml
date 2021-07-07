import { Attribute } from './Types';
import TextNode from './TextNode';

export default class ElementNode {
  nodeTypes: string[];
  childNodes: (ElementNode | TextNode)[];
  attributes: Attribute[];
  skipElementHtml = false;
  
  constructor(skipElementHtml = false) {
    this.skipElementHtml = skipElementHtml;

    this.nodeTypes = [];
    this.childNodes = [];
    this.attributes = [];
  }
  
  toHtml() {
    let childrenHtml = '';

    this.childNodes.forEach(childNode => { childrenHtml += childNode.toHtml(); });

    if (this.skipElementHtml)
      return childrenHtml;

    const nodeType = this.nodeTypes[0] || 'div';
    const attributes = this.buildAttributes();
      
    if (this.childNodes.length === 0 && this.isVoidElement(nodeType))
      return `<${nodeType}${attributes} />`;

    return `<${nodeType}${attributes}>${childrenHtml}</${nodeType}>`;
  }

  private buildAttributes(): string {
    return this.attributes.reduce((str, attribute) => {
        str += ` ${attribute.name}`;

        if (attribute.value !== undefined)
            str += `="${attribute.value}"`;

        return str;
      }, '');
  }

  private isVoidElement(nodeType: string): boolean {
    switch (nodeType) {
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'embed':
      case 'hr':
      case 'img':
      case 'input':
      case 'link':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
      case 'wbr':
        return true;
      default:
        return false;
    }
  }
}
