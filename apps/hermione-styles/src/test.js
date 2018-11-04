import loader from './index';

const test = `style Test ( ) {
  test: "aloha";
}

export type TestProps {
  test: string;
}

style Test <TestProps> ({ test = "hey" }) {
  test: "aloha";
}

style Body () {
  background: "#f00";
}
`;

console.log(loader(test))