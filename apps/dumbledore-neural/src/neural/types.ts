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
  backprop(): void,
  calculateCost(expected: number): number,
  updateWeights(learningRate: number): void,
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
  error: number,

  forward(): Iterable<Neuron>,
  backward(): Iterable<Neuron>,
  output(): number[],
  inspect(): { inputs: number[], outputs: number[], error: number[] },
  predict(this: Network, values: number[]): number[],
  learn(values: number[], answers: number[]): void,
  setInput(values: number[]): void,
}