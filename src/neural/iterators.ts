import { Network, Neuron, BIAS } from './types';

export const networkIterator =
  <N extends keyof Network, D extends keyof Neuron>(neuronsKey: N, directionKey: D) =>
    function (): Iterable<Neuron> {
      return {
        [Symbol.iterator]: () => {
          const queue: Neuron[] = [];
          const viewed: Set<Neuron> = new Set();

          // Skip first layer of neurons
          // This is necessary both ways
          for (let item of this[neuronsKey]) {
            viewed.add(item);

            for (let [neuron, _] of item[directionKey]) {
              if (!viewed.has(neuron) && neuron.id !== BIAS) {
                viewed.add(neuron);
                queue.push(neuron);
              }
            }
          }

          const iterator: Iterator<Neuron> = {
            next() {
              const item = queue.shift();

              if (!item) return {
                done: true,
                value: undefined,
              }

              // @ts-ignore
              for (let [neuron, _] of item[directionKey]) {
                if (!viewed.has(neuron) && neuron.id !== BIAS) {
                  viewed.add(neuron);
                  queue.push(neuron);
                }
              }

              return {
                done: false,
                value: item,
              };
            }
          }
          return iterator
        }
      }
    }