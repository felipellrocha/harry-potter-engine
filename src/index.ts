import { newNetwork } from './neural/network';

const network = newNetwork([2, 1]);

//console.log(network.inputs);
/*
for (let neuron of network.forward()) {
  console.log(neuron);
}
*/

console.log(network.output())
console.log("one");
network.learn([.125, .75], [.7]);
console.log(network.output())
console.log(network.inspect())