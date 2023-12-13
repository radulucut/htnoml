# htnoml

Experimental alternative to HTML

![Test](https://github.com/radulucut/htnoml/actions/workflows/test.yml/badge.svg)

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
    {class[container main] > This is HTnoML syntax}
  }
}
```
