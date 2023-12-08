package htnoml

import "io"

type Node struct {
	ElementType *Chunk
	Text        *Chunk      // Only for text nodes
	Attributes  []Attribute // Only for element nodes
	Children    []Node      // Only for element nodes
}

type Chunk struct {
	Start int
	End   int
}

type Attribute struct {
	Name  *Chunk
	Value *Chunk
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

func (p *Parser) Parse() {
	p.node = &Node{}
	childParentMap := map[*Node]*Node{}
	curr := p.node
	for p.peekToken() != nil {
		t := p.nextToken()
		if t.Type == TokenTypeWhitespace {
			continue
		}
		if t.Type == TokenTypeReserved && p.buf[t.Start] == ':' {
			curr.ElementType = &Chunk{
				Start: t.Start,
				End:   t.End,
			}
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
			End:   p.pos - 1,
		}
	}
	if p.isReserved(p.buf[p.pos]) {
		p.pos++
		p.col++
		return &Token{
			Type:  TokenTypeReserved,
			Start: p.pos - 1,
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
		End:   p.pos - 1,
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
