import { Thinkerer, Connection } from "./types";

export const newRegularThinkerer: Thinkerer = {
  activate(): void {
    let value: number = 0.0;

    for (let [prev, connection] of this.left.entries()) {
      value += connection.weight * prev.value;
    }

    this.weightedInput = value;
    this.value = this.activation(value);
  },
  backprop(): void {
    let error: number = 0.0;

    for (let [prev, connection] of this.right.entries()) {
      error += connection.weight * prev.error;
    }

    this.error = error;
  },
  calculateCost(expected: number): void {
    //this.error = .5 * ((expected - this.value) ** 2);
    this.error = (expected - this.value);
  },
  costDerivative(): void {

  },
  updateWeights(learningRate: number): void {
    for (let [prev, connection] of this.right.entries()) {
      connection.weight += learningRate * this.error * this.derivative(prev.value) * this.value;
    }
  },
};