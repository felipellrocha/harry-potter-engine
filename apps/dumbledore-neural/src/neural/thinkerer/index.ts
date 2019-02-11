import { Thinkerer, Neuron } from "neural/types";

export const newStochasticThinkerer: Thinkerer = {
  activate(this: Neuron): void {
    let weighted: number = 0.0;

    for (let [left, connection] of this.left.entries()) {
      weighted += connection.weight * left.value;
    }

    this.sum = weighted;
    this.value = this.activation.fn(weighted);
  },
  calculateCost(this: Neuron, expected: number): number {
    this.error = this.cost.der(expected - this.value) * this.activation.der(this.sum);


    return this.error;
  },
  backprop(this: Neuron): void {
    let error: number = 0.0;

    for (let [neuron, connection] of this.right.entries()) {
      error += connection.weight * neuron.error;
    }

    this.error = error * this.activation.der(this.sum);
    //console.log(this.id, error, this.error);
  },
  updateWeights(this: Neuron, learningRate: number): void {
    //console.log(`left: ${[...this.left.keys()].map(n => n.id)}`);
    for (let [left, connection] of this.left.entries()) {
      const pw = connection.weight;
      const update = learningRate
        * this.error
        * left.value;

      connection.weight -= update;
    }
  },
};

export const newBiasedThinkerer: Thinkerer = {
  activate(this: Neuron): void { throw new Error() },
  backprop(this: Neuron): void { throw new Error() },
  calculateCost(this: Neuron, expected: number): number { throw new Error() },
  updateWeights(this: Neuron, learningRate: number): void { throw new Error() },
}