import { BIAS, Neuron } from './types';
import { newThinkable } from './thinkable';
import {
  newStochasticThinkerer,
  newBiasedThinkerer,
} from './thinkerer';

let id = 0;

const squaredError = {
  cost(this: Neuron, difference: number): number { return .5 * (difference ** 2); },
  costDerivative(this: Neuron, difference: number): number { return (difference); },
}

export const newSigmoid = (): Neuron => {

  const activation = (value: number): number => 1 / (1 + (Math.E ** value));
  const derivative = (value: number): number => value * (1.0 - value);

  id++;

  return {
    ...newThinkable(),
    ...newStochasticThinkerer,
    ...squaredError,
    id: `${id}`,
    activation,
    derivative,
  }
};

export const newBias = (): Neuron => {
  const activation = (): number => 1;
  const derivative = (): number => 1;

  return {
    ...newThinkable(),
    ...newBiasedThinkerer,
    ...squaredError,
    id: BIAS,
    value: 1,
    error: 0,

    activation,
    derivative,
  }
}