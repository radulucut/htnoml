package main

import (
	"log"
	"os"

	p "github.com/radulucut/htnoml/parser"
)

func main() {
	file, err := os.Open("example.htnoml")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	var bufSize uint = 4096
	tokenizer := p.NewTokenizer(file, &bufSize)
	parser := p.NewParser(tokenizer)

	parser.Parse()
}
