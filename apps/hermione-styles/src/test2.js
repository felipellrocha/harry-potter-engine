import loader from './index';

const test = `export style Graph () {
  (line): {
    stroke-width: #000;
  };
}
`;

console.log(loader(test))