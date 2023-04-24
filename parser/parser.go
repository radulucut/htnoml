package parser

type Parser struct {
	tokenizer *Tokenizer
}

func NewParser(tokenizer *Tokenizer) *Parser {
	return &Parser{
		tokenizer: tokenizer,
	}
}

func (p *Parser) Parse() {
}

type NodeType byte

const (
	Root    NodeType = 1
	Element NodeType = 2
	Text    NodeType = 3
)

type Attribute struct {
	Name  *[]byte
	Value *[]byte
}

type Node struct {
	Type        NodeType
	ElementType *string
	Text        *[]byte
	Attributes  *[]*Attribute
	Children    *[]*Node
}
