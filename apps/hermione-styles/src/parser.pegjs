iBody =
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
    element: Element?
    ws*
    name: $(char+)
    ws*
    type:OptionalType?
    ws*
    args: Args
    ws*
    rules: Rules
    ws*
    {
    	return {
        	t: "style",
        	exp: !!exp,
            name,
            element: element ? element : 'div',
            type: type,
            args,
            rules: rules,
        }
    }

Element = '<' ws* element:$(!'>' .)* ws* '>'
	{
    	return element
    }
Rules = '{' ws* rules:RuleMatcher* '}'
	{
    	return rules
    }
Args = '(' ws* args:$(!')' .)* ws* ')'
	{
    	return args
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