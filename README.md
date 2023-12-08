# htnoml

Experimental DSL that compiles to HTML.

### Example

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
    {class[container main] > This HTnoML syntax}
  }
}
```