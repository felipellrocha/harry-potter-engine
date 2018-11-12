import { Data, Line } from 'types';

const s4 = () => Math
  .floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);

export const guid = (): string => s4() + "-" + s4();

export const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomElement = <T>(arr: T[]): [number, T] => {
  const index = random(0, arr.length - 1);

  return [index, arr[index]];
}

export const generateTest = (n: number = 5): Data[] => [...new Array(n)].map(_ => {
  const x = random(0, 1);
  const y = random(0, 1);
  const input = [x, y];
  const expected = [x ^ y, 1 - (x ^ y)];
  const guess = [random(0, 1), random(0, 1)];

  return { input, expected, guess };
});

export const calculateLine = (m: number, b: number, x1: number, x2: number): Line => {
  const y1 = m * x1 + b;
  const y2 = m * x2 + b;

  return {
    x1: this.xRange(x1),
    y1: this.yRange(y1),
    x2: this.xRange(x2),
    y2: this.yRange(y2)
  };
}
