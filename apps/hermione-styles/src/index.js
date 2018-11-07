import parser from './parser.pegjs';
import { camelCase } from 'change-case';

const generateRules = (rule) => {
  const { name, value, values } = rule;

  if (values) {
    console.log("here")
    const rules = values.map(generateRules);
    return `[${name}]: {\n${rules.join('\n')}\n},`;
  } else {
    return `${camelCase(name)}: "${value}",`;
  }
}

const generateStyle = (style) => {
  const {
    name,
    args,
    rules,
    type,
    exp,
  } = style;

  console.log(style);


  const typeString = type ?
    `<${type}>` :
    '';

  return `
    ${exp ? "export" : ""} const ${name} = styled${typeString}('div')((${args}) => ({
      ${rules.map(generateRules).join('\n')}
    }));
  `;
}

export default function (source) {
  const blocks = parser.parse(source);
  //console.log(blocks);

  const doc = blocks.map(block => {
    if (block.t === "context") return block.body;
    else return generateStyle(block);
  });

  //console.log(doc);

  const final = `
  import styled from 'react-emotion';

  ${doc.join("\n")}
  `;

  //console.log(final);

  return final;
}