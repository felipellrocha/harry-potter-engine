import { Network, Neuron, BIAS } from 'neural/types';

type Options<Net extends keyof Network, Neu extends keyof Neuron> = {
  neuronsKey: Net,
  directionKey: Neu,
  skipKey?: Net,
}

const queueNeuron = (neuron: Neuron, queue: Neuron[], viewed: Set<Neuron>) => {
  if (!viewed.has(neuron) && neuron.id !== BIAS) {
    viewed.add(neuron);
    queue.push(neuron);
  }
}

export const networkIterator =
  <N extends keyof Network, D extends keyof Neuron>({
    neuronsKey,
    directionKey,
    skipKey,
  }: Options<N, D>) =>
    function (): Iterable<Neuron> {
      return {
        [Symbol.iterator]: () => {

          const skippedNeurons: Neuron[] = (skipKey) ? [...this[skipKey]] : [];

          const queue: Neuron[] = [];
          const viewed: Set<Neuron> = new Set(skippedNeurons);

          // if we ask to skip, let's skip

          for (let neuron of this[neuronsKey]) queueNeuron(neuron, queue, viewed);

          for (let item of this[neuronsKey]) {
            for (let [neuron, _] of item[directionKey]) {
              queueNeuron(neuron, queue, viewed);
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
              for (let [neuron, _] of item[directionKey]) queueNeuron(neuron, queue, viewed);

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