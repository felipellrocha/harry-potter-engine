import {
  newNetwork,
} from './index';

const zip = <T1, T2>(arr1: T1[], arr2: T2[]): [T1, T2][] => {
  return arr1.map((_, index): [T1, T2] => [arr1[index], arr2[index]]);
};

describe('Network', () => {
  const n = newNetwork([2, 3, 1], {
    learningRate: 1,
    withBias: false,
  });

  const setConnections = [
    0.8, 0.4, 0.3,
    0.2, 0.9, 0.5,
    0.3, 0.5, 0.9,
  ];

  zip(setConnections, n.connections).map(([newWeight, connection]) => {
    connection.weight = newWeight;
  });

  // Run the cycle once now that we set the variables correctly
  n.learn([1, 1], [0]);

  it('forward propagates correctly', () => {
    const values = n.neurons.map(n => n.value);
    // These values were calculated by hand previously, so we had
    // something to test with.
    // https://stevenmiller888.github.io/mind-how-to-build-a-neural-network/
    const expected = [
      1,
      1,
      0.7310585786300049,
      0.7858349830425586,
      0.6899744811276125,
      0.7743802720529458,
    ];

    expect(values).toEqual(expected)
  });

  fit('backward propagates correctly', () => {
    console.log(n.error);
    /*
    for (let neuron of n.fullForward()) {
      console.log(neuron.id, neuron.sum, neuron.value);
    }
    */
    console.log('here', n.outputs.map((neuron: any) => neuron.value));
    console.log('here', n.outputs.map((neuron: any) => neuron.error));
    console.log(n.outputs.map(n => ({
      id: n.id,
      z: n.sum,
      error: n.error,
      value: n.value,
    })));
    const weights = n.connections.map(c => c.weight);

    const expected = [
      0.712,
      0.3548,
      0.2681,
      0.112,
      0.8548,
      0.4681,
      0.1162,
      0.329,
      0.708,
    ];

    const error = zip(weights, expected).map(([w, e]) => e - w);
    //console.log(error);

    expect(weights).toEqual(expected);
    expect(true).toBe(false);
  })
});









/*
console.log(n.connections)
console.log(n.neurons.map(n => ({
  value: n.value,
  id: n.id,
  /*
  left: [...n.left.keys()].map(nn => ({
    id: nn.id,
  })),
  right: [...n.right.keys()].map(nn => ({
    id: nn.id,
  })),
})));
*/
