import { Neuron } from './types';
import { newThinkable } from './thinkable';

export interface Sigmoid extends Neuron { };

export const newSigmoid = (): Sigmoid => ({
    ...newThinkable(),

    activation(): number {
        return 1 / (1 + (Math.E ** this.value));
    },

    derivative(): number {
        return this.value * (1.0 - this.value);
    },
});