import { BIAS, Neuron } from './types';
import { newThinkable } from './thinkable';
import { newRegularThinkerer } from './thinkerer';

export const newSigmoid = (): Neuron => {

  const activation = (value: number): number => 1 / (1 + (Math.E ** value));
  const derivative = (value: number): number => value * (1.0 - value);

  return {
    ...newThinkable(),
    ...newRegularThinkerer,
    activation,
    derivative,
  }
};

export const newBias = (): Neuron => {
  const activation = (value: number): number => value;
  const derivative = (value: number): number => value;
  const activate = (): void => { };
  const calculateError = (): void => { };
  const updateWeights = (): void => { };

  return {
    ...newThinkable(),
    ...newRegularThinkerer,
    id: BIAS,
    value: 1,
    weightedInput: 1,
    error: 0,

    activate,
    calculateError,
    updateWeights,
    activation,
    derivative,
  }
}