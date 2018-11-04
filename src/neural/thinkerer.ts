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
  calculateError(): void {
    let error: number = 0.0;

    for (let [prev, connection] of this.left.entries()) {
      error += connection.weight * prev.value;
    }

    this.value = this.activation(error);
  },
  backprop(): void {
    for (let [prev, connection] of this.right.entries()) {
      connection.weight = this.derivative(1 - this.weightedInput);
    }
  },
  calculateCost(expected: number): void {
    this.error = .5 * ((expected - this.value) ** 2);
  },
  costDerivative(): void {

  },
};