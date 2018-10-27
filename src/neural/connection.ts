import { Connection, Neuron } from './types';

export const newConnection = (
  n1: Neuron,
  n2: Neuron,
  weight: number = 0.5,
): void => {
  const connection: Connection = {
    weight,
  };

  n1.right.set(n2, connection);
  n2.left.set(n1, connection);
}