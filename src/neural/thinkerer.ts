import { Thinkerer, Neuron } from "./types";

export const newRegularThinkerer = (): Thinkerer => {

  const activate = (neuron: Neuron): void => {
    let value: number = 0.0;

    for (let [prev, connection] of neuron.left.entries()) {
      value += connection.weight * prev.value;
    }

    neuron.value = neuron.activation(value);
  }

  return { activate };
}