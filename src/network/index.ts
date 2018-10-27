import { Network } from './types';

import { newSigmoid } from './sigmoid';
import { newConnection } from './connection';

export const newNetwork = (
  layers: number[],
  learningRate: number = 0.5
): Network => {

  const neurons = layers.map(layer => [...new Array(layer)].map(_ => newSigmoid()));

  // Fully connected network
  for (let index of neurons.keys()) {
    if (index === layers.length - 1) break;


    for (let n1 of neurons[index]) {
      for (let n2 of neurons[index + 1]) {
        newConnection(n1, n2);
      }
    }
  }
  // Fully connected network

  return {
    inputs: neurons[0],
    outputs: neurons[layers.length - 1],
    learningRate,
  }
}