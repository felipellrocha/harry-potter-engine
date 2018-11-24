import { Network, Neuron, BIAS } from './types';

import { networkIterator } from './iterators';

import { newSigmoid, newBias } from './neuron';
import { connect, newConnection } from './connection';

const fullyConnectNetwork = (neurons: Neuron[][], bias: Neuron): void => {
  for (let index of neurons.keys()) {
    for (let n1 of neurons[index]) {

      const nConnection = newConnection();
      const bConnection = newConnection();
      // let's get everyone connected to the
      // bias before breaking
      connect(n1, bConnection, bias);

      if (index === neurons.length - 1) break;

      for (let n2 of neurons[index + 1]) {
        connect(bias, bConnection, n2);
        connect(n1, nConnection, n2);
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
    error: 0,

    fullForward: networkIterator({ neuronsKey: "inputs", directionKey: "right" }),
    fullBackward: networkIterator({ neuronsKey: "outputs", directionKey: "left" }),
    forward: networkIterator({ neuronsKey: "inputs", directionKey: "right", skipKey: "inputs" }),
    backward: networkIterator({ neuronsKey: "outputs", directionKey: "left", skipKey: "outputs" }),
    invert: networkIterator({ neuronsKey: "outputs", directionKey: "left", skipKey: "inputs" }),

    getRepresentation(this: Network) {
      let links = [];
      let nodes = [];

      nodes.push({
        name: BIAS,
      });

      // Get links from input layer
      // to the bias
      for (let neuron of this.inputs) {
        for (let [prev, connection] of neuron.right.entries()) {
          if (prev.id !== BIAS) continue;
          links.push({
            target: prev.id,
            source: neuron.id,
            value: connection.weight,
          });
        }
      }

      for (let neuron of this.fullForward()) {
        nodes.push({
          name: neuron.id
        });
        for (let [prev, connection] of neuron.left.entries()) {
          links.push({
            source: prev.id,
            target: neuron.id,
            value: connection.weight,
          });
        }
      }

      return {
        nodes,
        links,
      }
    },
    output(this: Network) { return this.outputs.map((neuron: Neuron) => neuron.value) },
    inspect(this: Network) {
      const inputs = this.inputs.map((neuron: Neuron) => neuron.value);
      const outputs = this.outputs.map((neuron: Neuron) => neuron.value);
      return { inputs, outputs, error: [this.error] };
    },
    predict(this: Network, values: number[]): number[] {
      this.setInput(values);

      for (let neuron of this.forward()) {
        //console.log(`Activating <${neuron.id}, ${neuron.value}>`);
        neuron.activate();
      }

      return this.output()
    },
    learn(this: Network, values: number[], answers: number[]) {
      this.setInput(values);

      for (let neuron of this.forward()) {
        //console.log(`Activating <${neuron.id}, ${neuron.value}>`);
        neuron.activate();
      }

      let error = 0;
      for (let index of this.outputs.keys()) {
        const neuron = this.outputs[index];
        const answer = answers[index];

        error += neuron.calculateCost(answer);
      }
      this.error = error;

      for (let neuron of this.backward()) {
        //console.log(`Backpropping <${neuron.id}, ${neuron.value}>`);
        neuron.backprop();
      }

      for (let neuron of this.invert()) {
        //console.log(`Updating weights <${neuron.id}>`);
        neuron.updateWeights(this.learningRate);
      }
    },
    setInput(this: Network, values: number[]) {
      for (let index of this.inputs.keys()) {
        const input = values[index];
        const neuron = this.inputs[index];

        neuron.value = input;
      }
    }
  }
}