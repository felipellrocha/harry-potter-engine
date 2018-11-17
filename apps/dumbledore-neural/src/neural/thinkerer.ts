import { Thinkerer, Neuron, BIAS } from "./types";

export const newStochasticThinkerer: Thinkerer = {
  activate(this: Neuron): void {
    let weighted: number = 0.0;

    for (let [left, connection] of this.left.entries()) {
      weighted += connection.weight * left.value;
    }

    this.value = this.activation(weighted);
  },
  backprop(this: Neuron): void {
    let error: number = 0.0;

    for (let [right, connection] of this.right.entries()) {
      error += connection.weight * right.error;
    }

    this.error = error;
  },
  calculateCost(this: Neuron, expected: number): number {
    this.error = this.value - expected;

    return this.cost(this.error);
  },
  updateWeights(this: Neuron, learningRate: number): void {
    for (let [right, connection] of this.right.entries()) {
      if (right.id === BIAS) {
        const update = learningRate
          * right.costDerivative(right.error)
          * right.derivative(right.value)
          * this.value;

        connection.weight += update;
      } else {
        const update = learningRate
          * this.costDerivative(this.error)
          * this.derivative(this.value);

        connection.weight += update;
      }
    }
  },
};

export const newBiasedThinkerer: Thinkerer = {
  activate(this: Neuron): void { },
  backprop(this: Neuron): void { },
  calculateCost(this: Neuron, expected: number): number { return 0 },
  updateWeights(this: Neuron, learningRate: number): void { },
}