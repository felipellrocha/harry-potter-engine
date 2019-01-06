import { newPlain, newBias } from 'neural/neuron';
import { connect, newConnection } from 'neural/connection';

const createTest = () => {

  const s1 = newPlain();
  const s2 = newPlain();
  const s3 = newPlain();
  const bias = newBias();

  const c1 = newConnection();
  const c2 = newConnection();
  const cb = newConnection();

  connect(s1, c1, s3);
  connect(s2, c2, s3);
  connect(bias, cb, s3);

  return { s1, s2, s3, bias, c1, c2, cb }
}

describe('Stochastic Thinkerer', () => {

  it('sums up correctly when activated', () => {
    const { s3 } = createTest();

    expect(s3.value).toBe(0.5);
    s3.activate();
    expect(s3.value).toBe(1);
  });

  it('calculates costs correctly', () => {
    const { s3 } = createTest();

    s3.value = 0.5;
    s3.calculateCost(1);
    expect(s3.error).toBe(0.25);
  });

  it('moves error back correctly', () => {
    const { s1, s2 } = createTest();

    s1.backprop();
    s2.backprop();

    expect(s1.error).toBe(0.25);
    expect(s2.error).toBe(0.25);
  });

  it('updates weights correctly', () => {
    const { s3, c1, c2, cb } = createTest();

    s3.error = 0.5;

    s3.updateWeights(1, 1);

    expect(c1.weight).toBe(0.25);
    expect(c2.weight).toBe(0.25);
    expect(cb.weight).toBe(0);
  });
})