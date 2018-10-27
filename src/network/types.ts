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

export interface Neuron extends Thinkable {
    activation(): number,
    derivative(): number,
}

export interface Network {
    inputs: Neuron[],
    outputs: Neuron[],

    learningRate: number,
}