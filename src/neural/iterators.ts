import { Network, Neuron, BIAS } from './types';

export const networkIterator =
  <N extends keyof Network, D extends keyof Neuron>(neuronsKey: N, directionKey: D) =>
    function (): Iterable<Neuron> {
      return {
        [Symbol.iterator]: () => {
          const queue: Neuron[] = [...this[neuronsKey]];
          const viewed: Set<Neuron> = new Set();

          const iterator: Iterator<Neuron> = {
            next() {
              const pop = queue.pop();

              if (!pop) return {
                done: true,
                value: undefined,
              }

              viewed.add(pop);

              // @ts-ignore
              for (let [neuron, _] of pop[directionKey]) {
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
    }