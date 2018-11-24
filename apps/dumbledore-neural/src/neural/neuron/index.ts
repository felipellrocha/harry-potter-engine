import { BIAS, Neuron } from 'neural/types';
import { newThinkable } from 'neural/thinkable';
import {
  newStochasticThinkerer,
  newBiasedThinkerer,
} from 'neural/thinkerer';

let id = 0;

const squaredError = {
  cost(this: Neuron, difference: number): number { return .5 * (difference ** 2); },
  costDerivative(this: Neuron, difference: number): number { return (difference); },
}

export const sigmoid = {
  activation: (value: number): number => 1 / (1 + (value / Math.E)),
  derivative: (value: number): number => value * (1.0 - value),
}

const bias = {
  activation: (): number => 1,
  derivative: (): number => 1,
}

// Useful for testing
const plain = {
  activation: (value: number): number => value,
  derivative: (value: number): number => value,
}

export const newPlain = (): Neuron => {
  id++;

  return {
    ...newThinkable(),
    ...newStochasticThinkerer,
    ...squaredError,
    ...plain,
    id: `${id}`,
  }
};

export const newSigmoid = (): Neuron => {
  id++;

  return {
    ...newThinkable(),
    ...newStochasticThinkerer,
    ...squaredError,
    ...sigmoid,
    id: `${id}`,
  }
};

export const newBias = (): Neuron => {
  return {
    ...newThinkable(),
    ...newBiasedThinkerer,
    ...squaredError,
    ...bias,
    id: BIAS,
    value: 1,
    error: 0,
  }
}