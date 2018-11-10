import { newNetwork } from './neural/network';

const network = newNetwork([2, 2, 1]);

network.learn([1, 0], [1]);
console.table(network.inspect())