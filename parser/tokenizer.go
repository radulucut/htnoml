package parser

import "io"

type Tokenizer struct {
	Pos    int
	Line   int
	Col    int
	reader io.ReadSeeker
	token  *Token
	buf    *[]byte
}

func NewTokenizer(reader io.ReadSeeker, bufSize *uint) *Tokenizer {
	buf := make([]byte, *bufSize)

	return &Tokenizer{
		Pos:    0,
		Line:   1,
		Col:    1,
		reader: reader,
		token:  nil,
		buf:    &buf,
	}
}

func (t *Tokenizer) Next() (*Token, error) {
	isEOF := false
	n, err := t.reader.Read(*t.buf)
	if err != nil {
		if err == io.EOF {
			isEOF = true
		} else {
			return nil, err
		}
	}

	if n == 0 && isEOF {
		return nil, nil
	}

	// TODO: implement

	return nil, nil
}

func (t *Tokenizer) Peek() *Token {
	// TODO: implement
	return nil
}

func (t *Tokenizer) isWhitespace(b *byte) bool {
	switch *b {
	case ' ', '\t', '\n', '\r':
		return true
	}

	return false
}

func (t *Tokenizer) isReserved(b *byte) bool {
	switch *b {
	case '{', '}', '[', ']', ':', '>':
		return true
	}

	return false
}

func (t *Tokenizer) isIdentifier(b *byte) bool {
	if t.isWhitespace(b) || t.isReserved(b) {
		return false
	}

	return true
}

type TokenType byte

const (
	Whitespace TokenType = 1
	Identifier TokenType = 2
	Reserved   TokenType = 3
)

type Token struct {
	Type  TokenType
	Value *[]byte
}
