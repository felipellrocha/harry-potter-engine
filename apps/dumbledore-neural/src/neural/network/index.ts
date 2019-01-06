import { Network, Neuron, BIAS, Connection } from 'neural/types';

import { networkIterator } from 'neural/iterators';

import { newBias, newSigmoid } from 'neural/neuron';
import { connect, newRandomConnection } from 'neural/connection';

const fullyConnectNetwork = (neurons: Neuron[][], bias: Neuron | null): Connection[] => {
  const connections: Connection[] = [];

  for (let index of neurons.keys()) {
    for (let n1 of neurons[index]) {
      if (index === neurons.length - 1) break;

      for (let n2 of neurons[index + 1]) {
        const nConnection = newRandomConnection();
        connect(n1, nConnection, n2);
        connections.push(nConnection);
      }
    }
  }

  // if we have a bias,
  // let's get everyone connected to the
  // bias before potentially breaking
  if (bias) {
    const bConnection = newRandomConnection();

    for (let [i, layer] of neurons.entries()) {
      for (let n of layer) {
        if (i !== 0) connect(bias, bConnection, n);
        if (i !== neurons.length) connect(n, bConnection, bias);
        connections.push(bConnection);
      }
    }
  }

  return connections;
}

type Options = {
  learningRate?: number,
  withBias?: boolean,
}
export const newNetwork = (
  layers: number[],
  {
    learningRate = 0.5,
    withBias = true,
  }: Options = {},
): Network => {

  const bias = newBias();

  const neurons = layers.map(layer => [...new Array(layer)].map(_ => newSigmoid()));
  const connections = fullyConnectNetwork(neurons, withBias ? bias : null);

  return {
    neurons: ([] as Neuron[]).concat(...neurons),
    connections,

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

      this.calculateError(answers);

      for (let neuron of this.backward()) {
        //console.log(`Backpropping <${neuron.id}, ${neuron.value}>`);
        neuron.backprop();
      }

      for (let neuron of this.invert()) {
        neuron.updateWeights(this.error, this.learningRate);
        //console.log(`Updating weights <${neuron.id}>`);
      }
    },

    calculateError(answers: number[]) {
      let error = 0;
      for (let index of this.outputs.keys()) {
        const neuron = this.outputs[index];
        const answer = answers[index];

        error += neuron.calculateCost(answer);
      }
      this.error = error;
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