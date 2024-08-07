package htnoml

import (
	"io"
)

type Chunk struct {
	Start int
	End   int
}

type Attribute struct {
	Name  *Chunk
	Value *Chunk
}

type Node struct {
	ElementType *Chunk
	Text        *Chunk      // Only for text nodes
	Attributes  []Attribute // Only for element nodes
	Children    []Node      // Only for element nodes
}

type TokenType byte

const (
	TokenTypeWhitespace TokenType = 1
	TokenTypeIdentifier TokenType = 2
	TokenTypeReserved   TokenType = 3
)

type Token struct {
	Type  TokenType
	Start int
	End   int
}

type Parser struct {
	buf  []byte
	pos  int
	line int
	col  int
	curr *Token
	node *Node
}

func NewParser(reader io.ReadSeeker) (*Parser, error) {
	b, err := io.ReadAll(reader)
	if err != nil {
		return nil, err
	}
	return &Parser{
		line: 1,
		col:  1,
		buf:  b,
	}, nil
}

func (p *Parser) ToHTML(writer io.Writer) {
	if p.node == nil {
		p.parse()
	}
	p.nodeToHTML(writer, p.node, true)
}

func (p *Parser) nodeToHTML(w io.Writer, node *Node, isRoot bool) {
	if node.Text != nil {
		w.Write(p.buf[node.Text.Start:node.Text.End])
		return
	}
	var tag []byte
	if !isRoot {
		w.Write([]byte{'<'})
		if node.ElementType == nil {
			tag = []byte{'d', 'i', 'v'}
		} else {
			tag = p.buf[node.ElementType.Start:node.ElementType.End]
		}
		w.Write(tag)
		for _, attr := range node.Attributes {
			w.Write([]byte{' '})
			w.Write(p.buf[attr.Name.Start:attr.Name.End])
			if attr.Value != nil {
				w.Write([]byte{'=', '"'})
				w.Write(p.buf[attr.Value.Start:attr.Value.End])
				w.Write([]byte{'"'})
			}
		}
		if len(node.Children) == 0 && isVoidElement(string(tag)) {
			w.Write([]byte{' ', '/', '>'})
			return
		}
		w.Write([]byte{'>'})
	}
	for _, child := range node.Children {
		p.nodeToHTML(w, &child, false)
	}
	if !isRoot {
		w.Write([]byte{'<', '/'})
		w.Write(tag)
		w.Write([]byte{'>'})
	}
}

func (p *Parser) parse() {
	p.node = &Node{}
	childParentMap := map[*Node]*Node{}
	curr := p.node
	for p.peekToken() != nil {
		t := p.nextToken()
		if t.Type == TokenTypeWhitespace {
			continue
		}
		if t.Type == TokenTypeReserved && p.buf[t.Start] == ':' {
			t = p.nextToken()
			curr.ElementType = &Chunk{
				Start: t.Start,
				End:   t.End,
			}
			continue
		}
		if t.Type == TokenTypeIdentifier {
			name := &Chunk{
				Start: t.Start,
				End:   t.End,
			}
			var value *Chunk
			t = p.nextToken()
			if t.Type == TokenTypeReserved && p.buf[t.Start] == '[' {
				t = p.nextToken()
				start := t.Start
				pt := p.peekToken()
				for pt != nil && !(pt.Type == TokenTypeReserved && p.buf[pt.Start] == ']') {
					t = p.nextToken()
					pt = p.peekToken()
				}
				value = &Chunk{
					Start: start,
					End:   t.End,
				}
			}
			curr.Attributes = append(curr.Attributes, Attribute{
				Name:  name,
				Value: value,
			})
			continue
		}
		if t.Type == TokenTypeReserved && p.buf[t.Start] == '{' {
			curr.Children = append(curr.Children, Node{})
			el := &curr.Children[len(curr.Children)-1]
			childParentMap[el] = curr
			curr = el
			continue
		}
		if t.Type == TokenTypeReserved && p.buf[t.Start] == '}' {
			curr = childParentMap[curr]
			continue
		}
		if t.Type == TokenTypeReserved && p.buf[t.Start] == '>' {
			t = p.nextToken()
			start := t.Start
			pt := p.peekToken()
			for pt != nil && !(pt.Type == TokenTypeReserved && p.buf[pt.Start] == '}') {
				t = p.nextToken()
				pt = p.peekToken()
			}
			curr.Children = append(curr.Children, Node{
				Text: &Chunk{
					Start: start,
					End:   t.End,
				},
			})
			continue
		}
	}
}

func (p *Parser) nextToken() *Token {
	token := p.curr
	p.curr = nil
	if token == nil {
		return p.readNextToken()
	}
	return token
}

func (p *Parser) peekToken() *Token {
	if p.curr == nil {
		p.curr = p.readNextToken()
	}
	return p.curr
}

func (p *Parser) readNextToken() *Token {
	if p.pos >= len(p.buf) {
		return nil
	}
	if p.isWhitespace(p.buf[p.pos]) {
		start := p.pos
		p.pos++
		p.col++
		for p.pos < len(p.buf) && p.isWhitespace(p.buf[p.pos]) {
			p.pos++
			p.col++
		}
		return &Token{
			Type:  TokenTypeWhitespace,
			Start: start,
			End:   p.pos,
		}
	}
	if p.isReserved(p.buf[p.pos]) {
		p.pos++
		p.col++
		return &Token{
			Type:  TokenTypeReserved,
			Start: p.pos - 1,
			End:   p.pos,
		}
	}
	start := p.pos
	for p.pos < len(p.buf) && p.isIdentifier(p.buf[p.pos]) {
		p.pos++
		p.col++
	}
	return &Token{
		Type:  TokenTypeIdentifier,
		Start: start,
		End:   p.pos,
	}
}

func (p *Parser) isWhitespace(b byte) bool {
	switch b {
	case '\n':
		p.line++
		p.col = 0
		return true
	case ' ', '\t', '\r':
		return true
	}
	return false
}

func (p *Parser) isReserved(b byte) bool {
	switch b {
	case '{', '}', '[', ']', ':', '>':
		return true
	}
	return false
}

func (p *Parser) isIdentifier(b byte) bool {
	if p.isWhitespace(b) || p.isReserved(b) {
		return false
	}
	return true
}
