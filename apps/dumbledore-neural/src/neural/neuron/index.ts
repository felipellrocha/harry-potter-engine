//import * as uuid from 'uuid/v4';
import {
  BIAS,
  Thinkable,
  Neuron,
  Activator,
  ActivatorType,
  ThinkableType,
  ThinkererType,
  Errator,
  ErratorType,
} from 'neural/types';

import {
  newStochasticThinkerer,
  newBiasedThinkerer,
} from 'neural/thinkerer';


let id = 0;

type Options = {
  activator?: ActivatorType,
  thinkable?: ThinkableType,
  thinkerer?: ThinkererType,
  error?: ErratorType,
}

export const plainError: Errator = {
  cost(difference: number): number { return difference; },
  costDerivative(difference: number): number { return difference; },
}

export const squaredError: Errator = {
  cost(difference: number): number { return .5 * (difference ** 2); },
  costDerivative(difference: number): number { return difference; },
}

export const sigmoid: Activator = {
  activation: (value: number): number => 1 / (1 + (Math.E ** -value)),
  derivative(this: Activator, value: number): number { return this.activation(value) * (1.0 - this.activation(value)) },
}

export const bias: Activator = {
  activation: (): number => 1,
  derivative: (): number => 1,
}

// Useful for testing
export const plain: Activator = {
  activation: (value: number): number => value,
  derivative: (value: number): number => value,
}


export const newPlainThinkable = (): Thinkable => {
  id++;

  return {
    id: `${id}`,
    sum: 0.5,
    value: 0.5,
    error: 0.5,

    left: new Map(),
    right: new Map(),
  }
}

export const newBiasThinkable = (): Thinkable => {
  return {
    id: BIAS,
    sum: 1,
    value: 1,
    error: 0,

    left: new Map(),
    right: new Map(),
  }
}

export const newRandomThinkable = (): Thinkable => {
  id++;

  return {
    id: `${id}`,
    sum: Math.random(),
    value: Math.random(),
    error: Math.random(),

    left: new Map(),
    right: new Map(),
  }
}

export const newNeuron = ({
  activator,
  thinkable = ThinkableType.RANDOM,
  thinkerer = ThinkererType.STOCHASTIC,
  error = ErratorType.SQUARED,
}: Options = {}): Neuron => {

  const active = (() => {
    if (activator === ActivatorType.SIGMOID) return sigmoid;
    else if (activator === ActivatorType.BIAS) return bias;
    else return plain;
  })();

  const think = (() => {
    if (thinkerer === ThinkererType.STOCHASTIC) return newStochasticThinkerer;
    else if (thinkerer === ThinkererType.BIAS) return newBiasedThinkerer;
  })();

  const err = (() => {
    if (error === ErratorType.SQUARED) return squaredError;
    else return plainError;
  })();

  const able = (() => {
    if (thinkable === ThinkableType.RANDOM) return newRandomThinkable();
    else if (thinkable === ThinkableType.BIAS) return newBiasThinkable();
    else return newPlainThinkable();
  })();

  return {
    id: `${id}`,
    ...able,
    ...think,
    ...err,
    ...active,
  }
}

export const newSigmoid = ({
  activator = ActivatorType.SIGMOID,
  ...options
}: Options = {}) => newNeuron({ activator, ...options });

export const newPlain = ({
  activator = ActivatorType.PLAIN,
  thinkable = ThinkableType.PLAIN,
  error = ErratorType.PLAIN,
  ...options
}: Options = {}) => newNeuron({ activator, thinkable, ...options });

export const newBias = ({
  activator = ActivatorType.BIAS,
  thinkable = ThinkableType.BIAS,
  thinkerer = ThinkererType.BIAS,
  ...options
}: Options = {}) => newNeuron({ activator, thinkable, thinkerer, ...options });