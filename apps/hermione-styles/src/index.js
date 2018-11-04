import parser from './parser.pegjs';

const generateRules = (rule) => {
  return `${rule.name}: "${rule.value}",`
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

  if (!type) {
    return `
      ${exp ? "export" : ""} const ${name} = styled('div')((${args}) => ({
        ${rules.map(generateRules)}
      }));
    `;
  } else {
    return `
      ${exp ? "export" : ""} const ${name} = styled<${type}>('div')((${args}) => ({
        ${rules.map(generateRules)}
      }));
    `;
  }
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

  console.log(final);

  return final;
}