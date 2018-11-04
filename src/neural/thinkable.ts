import * as uuid from 'uuid/v4';
import { Thinkable } from './types';

export const newThinkable = (): Thinkable => {
  return {
    id: uuid(),
    value: 0.5,
    weightedInput: 0.5,
    error: 0.5,

    left: new Map(),
    right: new Map(),
  }
}
