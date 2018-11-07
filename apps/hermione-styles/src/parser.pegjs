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
    ws*
    type:OptionalType?
    ws*
    '(' ws* args:$(!')' .)* ws* ')'
    ws*
    '{' ws* rules:RuleMatcher* '}'
    ws*
    {
    	return {
        	t: "style",
        	exp: !!exp,
            name,
            type: type,
            args,
            rules: rules,
        }
    }
    
OptionalType = '<' ws* name:$(!'>' .)* ws* '>'
	{ return name }
    
RuleMatcher = rule:Rule ws*
	{ return rule }

Rule = (ComplexRule / SimpleRule)

SimpleRule
	= name:$(char / "-")+
    sp* ":" sp*
    value:$(!";" .)*
    ";"
    {
    	return {
        name,
        value,
      }
    }
    
ComplexRule
	= "(" sp* name:$(!")" .)+ sp* ")"
      sp* ":" sp*
      "{" ws* values:RuleMatcher* "};"
    {
    	return {
        	name,
            values,
        }
    }


nameChar = char / "'" / '"'
char = [a-zA-z]
ws = sp / nl
sp = ' ' / '\t'
nl = '\n'