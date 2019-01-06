export type Edges = Map<Neuron, Connection>;

export interface Connection {
  weight: number,
}

export enum ThinkererType {
  STOCHASTIC,
  BIAS,
}

export enum ThinkableType {
  RANDOM,
  PLAIN,
  BIAS,
}

export enum ActivatorType {
  SIGMOID,
  PLAIN,
  BIAS,
}

export enum ErratorType {
  SQUARED,
  PLAIN,
}

export const BIAS = 'bias';

export interface Thinkable {
  id: string,
  sum: number,
  value: number,
  error: number,

  left: Edges,
  right: Edges,
}

export interface Thinkerer {
  activate(): void,
  backprop(): void,
  calculateCost(expected: number): number,
  updateWeights(error: number, learningRate: number): void,
}

export interface Activator {
  activation(value: number): number,
  derivative(value: number): number,
}
export interface Errator {
  cost(expected: number): number,
  costDerivative(expected: number): number,
}

export interface Neuron extends Thinkable, Thinkerer, Activator, Errator { }

export interface Representation {
  nodes: { name: string }[],
  links: { source: string; target: string; value: number }[],
}

export interface Network {
  inputs: Neuron[],
  outputs: Neuron[],
  neurons: Neuron[],
  connections: Connection[],

  learningRate: number,
  error: number,

  fullForward(): Iterable<Neuron>,
  fullBackward(): Iterable<Neuron>,
  forward(): Iterable<Neuron>,
  backward(): Iterable<Neuron>,
  invert(): Iterable<Neuron>,

  getRepresentation(): Representation,
  output(): number[],
  inspect(): { inputs: number[], outputs: number[], error: number[] },
  predict(this: Network, values: number[]): number[],
  learn(values: number[], answers: number[]): void,
  calculateError(answers: number[]): void,
  setInput(values: number[]): void,
}