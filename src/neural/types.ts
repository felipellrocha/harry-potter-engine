export type Edges = Map<Neuron, Connection>;

export interface Connection {
  weight: number,
}

export const BIAS = 'bias';

export interface Thinkable {
  id: string,
  value: number,
  error: number,

  left: Edges,
  right: Edges,
}

export interface Thinkerer {
  activate(): void,
}

export interface Activator {
  activation(value: number): number,
  derivative(value: number): number,
}

export interface Neuron extends Thinkable, Thinkerer, Activator { }

export interface Network {
  inputs: Neuron[],
  outputs: Neuron[],

  learningRate: number,
  forward(): Iterable<Neuron>,
  backward(): Iterable<Neuron>,
  output(): number[],
  inspect(): [number[], number[]],
  learn(values: number[], answers: number[]): void,
  setInput(values: number[]): void,
}