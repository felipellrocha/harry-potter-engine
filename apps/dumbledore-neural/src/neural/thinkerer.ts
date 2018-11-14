import { Thinkerer, Neuron } from "./types";

export const newStochasticThinkerer: Thinkerer = {
  activate(this: Neuron): void {
    let weighted: number = 0.0;

    for (let [prev, connection] of this.left.entries()) {
      weighted += connection.weight * prev.value;
    }

    this.value = this.activation(weighted);
  },
  backprop(this: Neuron): void {
    let error: number = 0.0;

    for (let [prev, connection] of this.right.entries()) {
      error += connection.weight * prev.error;
    }

    this.error = error;
  },
  calculateCost(this: Neuron, expected: number): number {
    const error = .5 * ((this.value - expected) ** 2);
    this.error = error;

    return error;
  },
  updateWeights(this: Neuron, learningRate: number): void {
    for (let [prev, connection] of this.right.entries()) {
      connection.weight += learningRate
        * this.error
        * this.derivative(prev.value)
        * this.value;
    }
  },
};