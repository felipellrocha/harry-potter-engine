import { Thinkerer, Neuron } from "neural/types";

export const newStochasticThinkerer: Thinkerer = {
  activate(this: Neuron): void {
    let weighted: number = 0.0;

    for (let [left, connection] of this.left.entries()) {
      weighted += connection.weight * left.value;
    }

    this.sum = weighted;
    this.value = this.activation(weighted);
  },
  calculateCost(this: Neuron, expected: number): number {
    this.error = this.cost(this.value - expected);
    //console.log(`expected: ${expected} predicted: ${this.value} error: ${this.error}`)

    return this.error;
  },
  backprop(this: Neuron): void {
    let error: number = 0.0;

    for (let [neuron, connection] of this.right.entries()) {
      error += connection.weight * neuron.error;
    }

    this.error = error;
  },
  updateWeights(this: Neuron, error: number, learningRate: number): void {
    console.log(`n: ${this.id}`);
    console.log(`left: ${[...this.left.keys()].map(n => n.id)}`);
    for (let [left, connection] of this.left.entries()) {
      const update = learningRate
        * this.costDerivative(error)
        * this.derivative(this.sum)
        * left.value;
      connection.weight -= update;

      console.log(`
        left.id <- this.id: this.error, this.value, left.value = update value;
        ${left.id} <- ${this.id}: ${this.error}, ${this.value}, ${left.value} = ${update};
        learningRate * this.costDerivative(this.error) * this.derivative(this.sum) * left.value = update;
        ${learningRate} * ${this.costDerivative(this.error)} * ${this.derivative(this.sum)} * ${left.value} = ${update};
        learning * cost_der() * act_der() * prev_val()
      `);
    }
  },
};

export const newBiasedThinkerer: Thinkerer = {
  activate(this: Neuron): void { },
  backprop(this: Neuron): void { },
  calculateCost(this: Neuron, expected: number): number { return 0 },
  updateWeights(this: Neuron, learningRate: number): void { },
}