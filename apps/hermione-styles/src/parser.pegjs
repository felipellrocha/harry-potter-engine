Body =
	blocks:Blocks*
    
Stoppers = "export style" / "style"

Blocks = Style / Context

Context =
	body: $(!Stoppers .)+
    {
    	return {
        t: "context",
        body,
        }
    }

Style
  = exp:("export")?
  	ws*
    "style"
    ws+
    name: $(char+)
    ws+
    type:('<' ws* $(!'>' .)* ws* '>')?
    ws*
    '(' ws* args:$(!')' .)* ws* ')'
    ws*
    '{' ws* rules:Rule* ws* '}'
    ws*
    {
    	return {
        	t: "style",
        	exp: !!exp,
          name,
          type: type && type[2],
          args,
          rules,
        }
    }

Rule
	= name: $(char+)
    ws*
    ":"
    ws*
    value:$(!";" .)*
    ";"
    {
    	return {
        name,
        value,
      }
    }


char = [a-zA-z]
ws = sp / nl
sp = ' ' / '\t'
nl = '\n'