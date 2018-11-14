import { BIAS, Neuron } from './types';
import { newThinkable } from './thinkable';
import { newStochasticThinkerer } from './thinkerer';

let id = 0;

export const newSigmoid = (): Neuron => {

  const activation = (value: number): number => 1 / (1 + (Math.E ** value));
  const derivative = (value: number): number => value * (1.0 - value);

  id++;

  return {
    ...newThinkable(),
    ...newStochasticThinkerer,
    id: `${id}`,
    activation,
    derivative,
  }
};

export const newBias = (): Neuron => {
  const activation = (value: number): number => value;
  const derivative = (): number => 1;
  const activate = (): void => { };

  return {
    ...newThinkable(),
    ...newStochasticThinkerer,
    id: BIAS,
    value: 1,
    error: 0,

    activate,
    activation,
    derivative,
  }
}