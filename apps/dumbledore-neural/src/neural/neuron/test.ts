import {
  squaredError,
  sigmoid,
} from './index';

describe('Neuron', () => {

  describe('Squared Error', () => {
    it('calculates the error correctly', () => {
      expect(squaredError.cost.fn(1.5)).toBe(1.125)
      expect(squaredError.cost.fn(1)).toBe(.5)

      expect(squaredError.cost.der(1.5)).toBe(1.5)
    })
  });

  describe('Sigmoid', () => {
    it('calculates the error correctly', () => {
      expect(sigmoid.activation.fn(1)).toBe(0.7310585786300049)
      expect(sigmoid.activation.fn(0)).toBe(0.5)
      expect(sigmoid.activation.fn(-1)).toBe(0.2689414213699951)

      expect(sigmoid.activation.der(1)).toBe(0.19661193324148185)
      expect(sigmoid.activation.der(0)).toBe(0.25)
      expect(sigmoid.activation.der(1)).toBe(0.19661193324148185)
    })
  });
});