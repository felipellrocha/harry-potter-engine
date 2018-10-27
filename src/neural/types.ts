export type Edges = Map<Neuron, Connection>;

export interface Connection {
  weight: number,
}

export interface Thinkable {
  id: string,
  value: number,
  error: number,

  left: Edges,
  right: Edges,
}

export interface Thinkerer {
  activate(neuron: Neuron): void,
}

export interface Neuron extends Thinkable, Thinkerer {
  activation(value: number): number,
  derivative(value: number): number,
}

export interface Network {
  inputs: Neuron[],
  outputs: Neuron[],

  learningRate: number,
}