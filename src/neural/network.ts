import { Network, Neuron } from './types';

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
        newConnection(n1, n2);
      }

    }
  }
}

export const newNetwork = (
  layers: number[],
  learningRate: number = 0.5,
): Network => {

  const neurons = layers.map(layer => [...new Array(layer)].map(_ => newSigmoid()));

  const bias = newBias();

  fullyConnectNetwork(neurons, bias);

  return {
    inputs: neurons[0],
    outputs: neurons[layers.length - 1],
    learningRate,
  }
}