import { newNetwork } from 'neural/network';

describe('Iterators', () => {
  const network = newNetwork([2, 2, 2], 1);

  it('iterates forwards in the correct order', () => {
    const order = [...network.forward()].map(n => n.id);

    expect(order).toEqual(['3', '4', '5', '6']);
  });

  it('iterates backwards in the correct order', () => {
    const order = [...network.backward()].map(n => n.id);

    expect(order).toEqual(['3', '4', '1', '2']);
  });

  it('iterates forwards in the correct order - Full', () => {
    const order = [...network.fullForward()].map(n => n.id);

    expect(order).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('iterates backwards in the correct order - Full', () => {
    const order = [...network.fullBackward()].map(n => n.id);

    expect(order).toEqual(['5', '6', '3', '4', '1', '2']);
  });

  it('iterates backwards in the correct order - Inverse', () => {
    const order = [...network.invert()].map(n => n.id);

    expect(order).toEqual(['5', '6', '3', '4',]);
  });
});