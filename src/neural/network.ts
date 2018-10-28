import { Network, BIAS, Neuron } from './types';

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

  const neurons = layers.map(layer => [...new Array(layer)].map(_ => newSigmoid()));

  const bias = newBias();

  fullyConnectNetwork(neurons, bias);
  console.log(this);

  return {
    inputs: neurons[0],
    outputs: neurons[layers.length - 1],
    learningRate,
    forward(): Iterable<Neuron> {
      return {
        [Symbol.iterator]: () => {
          const queue: Neuron[] = [...this.inputs];
          const viewed: Set<Neuron> = new Set();

          const iterator: Iterator<Neuron> = {
            next() {
              const pop = queue.pop();

              if (!pop) return {
                done: true,
                value: undefined,
              }

              viewed.add(pop);

              for (let [neuron, _] of pop.right) {
                if (!viewed.has(neuron) && neuron.id !== BIAS) {
                  queue.push(neuron);
                }
              }

              return {
                done: false,
                value: pop,
              };
            }
          }
          return iterator
        }
      }
    },
  }
}