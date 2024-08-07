# HTnoML

HTML-like DSL that that can be converted into HTML.

![Test](https://github.com/radulucut/htnoml/actions/workflows/test.yml/badge.svg)

### HTnoML syntax

```htnoml
{:html
  {:head
    {:meta charset[utf-8]}
    {:title > This is a HTML5 template}
    {:meta name[description] content[This is a HTML5 template]}
    {:meta name[author] content[Radu Lucut]}
    {:link rel[stylesheet] href[css/style.css]}
  }
  {:body
    {class[container main] > This is HTnoML syntax}
  }
}
```

HTML equivalent:

```html
<html>
  <head>
    <meta charset="utf-8" />
    <title>This is a HTML5 template</title>
    <meta name="description" content="This is a HTML5 template" />
    <meta name="author" content="Radu Lucut" />
    <link rel="stylesheet" href="css/style.css" />
  </head>

  <body>
    <div class="container main">This is HTnoML syntax</div>
  </body>
</html>
```

### Usage

```go
package main

import (
	"os"

	"github.com/radulucut/htnoml"
)

func main() {
	f, err := os.Open("example.htnoml")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	p, err := htnoml.NewParser(f)
	if err != nil {
		panic(err)
	}

	o, err := os.Create("example.html")
	if err != nil {
		panic(err)
	}
	defer o.Close()
	p.ToHTML(o) // Convert HTnoML to HTML
}
```
