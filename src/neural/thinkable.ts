import * as uuid from 'uuid/v1';
import { Thinkable } from './types';

export const newThinkable = (): Thinkable => {
    return {
        id: uuid(),
        value: 0.5,
        error: 0.5,

        left: new Map(),
        right: new Map(),
    }
}
