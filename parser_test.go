package htnoml

import (
	"log"
	"os"
	"testing"
)

func TestParser(t *testing.T) {
	t.Run("Parse", func(t *testing.T) {
		t.Run("should return correct html", func(t *testing.T) {
			f, err := os.Open("example.htnoml")
			if err != nil {
				t.Fatal(err)
			}
			defer f.Close()
			p, err := NewParser(f)
			if err != nil {
				t.Fatal(err)
			}
			p.Parse()
			log.Printf("%+v", p.node)
			// TODO: assert
		})
	})
}
