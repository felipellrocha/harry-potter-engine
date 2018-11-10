import { Network, Neuron } from './types';

import { networkIterator } from './iterators';

import { newSigmoid, newBias } from './neuron';
import { newConnection } from './connection';

const fullyConnectNetwork = (neurons: Neuron[][], bias: Neuron): void => {
  for (let index of neurons.keys()) {
    for (let n1 of neurons[index]) {

      // let's get everyone connected to the
      // bias before breaking
      newConnection(n1, bias);

      if (index === neurons.length - 1) break;

      for (let n2 of neurons[index + 1]) {
        newConnection(bias, n2);
        newConnection(n1, n2);
      }

    }
  }
}

export const newNetwork = (
  layers: number[],
  learningRate: number = 0.5,
): Network => {

  const neurons = layers.map(layer => [...new Array(layer)].map(_ => { return newSigmoid() }));

  const bias = newBias();

  fullyConnectNetwork(neurons, bias);

  return {
    inputs: neurons[0],
    outputs: neurons[layers.length - 1],
    learningRate,
    forward: networkIterator("inputs", "right"),
    backward: networkIterator("outputs", "left"),
    output() { return this.outputs.map((neuron: Neuron) => neuron.value) },
    inspect() {
      const inputs = this.inputs.map((neuron: Neuron) => neuron.value);
      const outputs = this.outputs.map((neuron: Neuron) => neuron.value);
      return { inputs, outputs };
    },
    learn(values: number[], answers: number[]) {
      this.setInput(values);

      for (let neuron of this.forward()) {
        console.log(`Activating <${neuron.id}, ${neuron.value}>`);
        neuron.activate();
      }

      for (let index of this.outputs.keys()) {
        const neuron = this.outputs[index];
        const answer = answers[index];

        neuron.calculateCost(answer);
      }

      for (let neuron of this.backward()) {
        console.log(`Backpropping <${neuron.id}, ${neuron.value}>`);
        neuron.backprop();
      }

      for (let neuron of this.backward()) {
        console.log(`Updating weights <${neuron.id}, ${neuron.value}>`);
        neuron.updateWeights();
      }
    },
    setInput(values: number[]) {
      for (let index of this.inputs.keys()) {
        const input = values[index];
        const neuron = this.inputs[index];

        neuron.value = input;
      }
      const inputs = this.inputs.map((neuron: Neuron) => neuron.value);
      console.log(inputs);
    }
  }
}