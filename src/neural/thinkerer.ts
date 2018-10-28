import { Thinkerer, Neuron } from "./types";

export const newRegularThinkerer: Thinkerer = {
  activate(): void {
    let value: number = 0.0;

    for (let [prev, connection] of this.left.entries()) {
      value += connection.weight * prev.value;
    }

    this.value = this.activation(value);
  }
};