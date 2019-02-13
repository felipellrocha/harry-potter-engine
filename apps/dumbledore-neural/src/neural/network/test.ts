import {
  newNetwork,
} from './index';

const zip = <T1, T2>(arr1: T1[], arr2: T2[]): [T1, T2][] => {
  return arr1.map((_, index): [T1, T2] => [arr1[index], arr2[index]]);
};

describe('Network', () => {
  it('forward propagates correctly', () => {
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
    n.learn([1, 0], [1]);

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
    const n = newNetwork([2, 2, 1], {
      learningRate: 1,
    });

    const setConnections = [
      0.09753849383713645,
      -0.017544284265774413,
      -0.02839817013591528,
      -0.1950664531905204,
      -0.1405523344747659,
      0.06353677043795256,
      0.1,
      0.1,
      0.09345206239530784,
      0.09993454172433623,
      0.22603799387000645,
    ];

    zip(setConnections, n.connections).map(([newWeight, connection]) => {
      connection.weight = newWeight;
    });

    // Run the cycle once now that we set the variables correctly
    n.learn([1, 0], [1]);
    expect(n.output()).toEqual([0.5454113802715955]);

    const weights = n.connections.map(c => c.weight);

    const expected = [
      0.09361398864137296,
      -0.015757016377336303,
      -0.02839817013591528,
      -0.1950664531905204,
      -0.07883215903150682,
      0.12221185611371312,
      0.1,
      0.1,
      0.08952755719954436,
      0.10172180961277434,
      0.33874769912434444,
    ];

    const error = zip(weights, expected).map(([w, e]) => e - (w || 0));

    expect(weights).toEqual(expected);
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
