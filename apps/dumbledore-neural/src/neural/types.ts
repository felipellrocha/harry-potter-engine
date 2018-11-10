export type Edges = Map<Neuron, Connection>;

export interface Connection {
  weight: number,
}

export const BIAS = 'bias';

export interface Thinkable {
  id: string,
  value: number,
  weightedInput: number,
  error: number,

  left: Edges,
  right: Edges,
}

export interface Thinkerer {
  activate(): void,
  backprop(): void,
  calculateCost(expected: number): void,
  costDerivative(): void,
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
  forward(): Iterable<Neuron>,
  backward(): Iterable<Neuron>,
  output(): number[],
  inspect(): { inputs: number[], outputs: number[] },
  learn(values: number[], answers: number[]): void,
  setInput(values: number[]): void,
}