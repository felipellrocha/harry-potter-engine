import {
  squaredError,
  sigmoid,
} from './index';

describe('Neuron', () => {

  describe('Squared Error', () => {
    it('calculates the error correctly', () => {
      expect(squaredError.cost(1.5)).toBe(2.25)
      expect(squaredError.cost(1)).toBe(1)

      expect(squaredError.costDerivative(1.5)).toBe(3)
    })
  });

  describe('Sigmoid', () => {
    it('calculates the error correctly', () => {
      expect(sigmoid.activation(1)).toBe(0.7310585786300049)
      expect(sigmoid.activation(0)).toBe(0.5)
      expect(sigmoid.activation(-1)).toBe(0.2689414213699951)

      expect(sigmoid.derivative(1)).toBe(0.19661193324148185)
      expect(sigmoid.derivative(0)).toBe(0.25)
      expect(sigmoid.derivative(1)).toBe(0.19661193324148185)
    })
  });
});