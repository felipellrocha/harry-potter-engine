import { newNetwork } from './neural/network';

const network = newNetwork([2, 1]);

//console.log(network.inputs);
/*
for (let neuron of network.forward()) {
  console.log(neuron);
}
*/

console.log(network.output())
network.setInput([.2, .3]);
console.log(network.inspect())