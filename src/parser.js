function parse(text) {
  const childParentMap = new Map();

  const rootNode = {
    type: Type.Element,
    nodeTypes: [],
    childNodes: [],
    attributes: []
  };

  let currentNode = rootNode;
  const stateStack = [];
  let pos = -1;
  let char;
  let chunk = '';
  let line = 1, col = 0;

  while(true) {
    pos++;
    char = text.charAt(pos);
    
    col++;
    if(char === '\n') {
      line++;
      col = 0;
    }

    if(!char)
      break;
 
    const lastState = stateStack.length ? stateStack[stateStack.length - 1] : State.None;
    let ignoreChar = false;

    switch(char) {

      case '{':
        // TODO: Allow escaping: \{
        if(lastState === State.AttrStart)
          break;
        
        if(lastState === State.NodeTypeStart) {
          currentNode.nodeTypes.push(chunk.trim());
          chunk = '';
          stateStack.pop();
        }

        const newNode = {
          type: Type.Element,
          nodeTypes: [],
          childNodes: [],
          attributes: []
        };
        currentNode.childNodes.push(newNode);
        childParentMap.set(newNode, currentNode);
        
        currentNode = newNode; 

        if(lastState === State.TextStart) {
          const childNode = {
            type: Type.Text,
            text: chunk
          };
          childParentMap.set(childNode, currentNode);

          currentNode.childNodes.push(childNode);

          chunk = '';
          stateStack.pop();
        }

        stateStack.push(State.NodeStart);
        ignoreChar = true;
        break;

      case ':':
        if(lastState !== State.NodeStart)
          break;

        stateStack.push(State.NodeTypeStart);
        
        ignoreChar = true;
        break;

      case '\n':
        if(lastState !== State.TextStart)
          ignoreChar = true;
      case '\t':
        if(lastState !== State.TextStart && lastState !== State.AttrStart)
          ignoreChar = true;
      case ' ':
        if(lastState === State.NodeTypeStart) {
          currentNode.nodeTypes.push(chunk);
          chunk = '';
          stateStack.pop();
          ignoreChar = true;
        }
        break;
      case '[':
        if(lastState === State.AttrStart)
          break;

        const attribute = {
          name: chunk, 
          value: undefined
        }
        currentNode.attributes.push(attribute);
        chunk = '';

        stateStack.push(State.AttrStart);
        ignoreChar = true;
        break;

      case ']':
        if(lastState === State.AttrStart)
          stateStack.pop();

        currentNode.attributes[currentNode.attributes.length - 1].value = chunk;
        chunk = '';

        ignoreChar = true;
        break;
      
      case '>':
        if(lastState !== State.NodeStart)
          break;

        stateStack.push(State.TextStart);

        chunk = '';
        ignoreChar = true;
        break;

      case '}':
        if(lastState === State.AttrStart)
          break;
        
        if(lastState === State.NodeTypeStart) {
          currentNode.nodeTypes.push(chunk);
          stateStack.pop();
        }
                
        if(lastState === State.TextStart) {
          const childNode = {
            type: Type.Text,
            text: chunk
          };
          childParentMap.set(childNode, currentNode);

          currentNode.childNodes.push(childNode);

          stateStack.pop();
        }

        if(lastState !== State.TextStart && lastState !== State.NodeStart && lastState !== State.NodeTypeStart)
          throw new Error(`Error: ${line}:${col}. State stack: ${stateStack.toString()}`); // TODO: Improve error messages

        currentNode = childParentMap.get(currentNode);

        chunk = '';
        stateStack.pop();
        ignoreChar = true;
        break;

    }
    
    if(!ignoreChar)
      chunk += char;
  }

  return rootNode;
}

const State = {
  None: 0,
  NodeStart: 1,
  NodeTypeStart: 2,
  AttrStart: 3,
  TextStart: 4
}

const Type = {
  None: 0,
  Element: 1,
  Text: 2
}

module.exports = { parse }'
