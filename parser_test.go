package htnoml

import (
	"os"
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestParser(t *testing.T) {
	t.Run("ToHTML", func(t *testing.T) {
		t.Run("basic.htnoml - should return correct html", func(t *testing.T) {
			f, err := os.Open("fixtures/basic.htnoml")
			if err != nil {
				t.Fatal(err)
			}
			defer f.Close()
			p, err := NewParser(f)
			if err != nil {
				t.Fatal(err)
			}
			html := p.ToHTML()
			expected, err := os.ReadFile("fixtures/basic.html")
			if err != nil {
				t.Fatal(err)
			}
			if diff := cmp.Diff(string(expected), html); diff != "" {
				t.Errorf("ToHTML() mismatch (-want +got):\n%s", diff)
			}
		})
	})
}
