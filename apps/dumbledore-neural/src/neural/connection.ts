import { Connection, Neuron } from './types';

export const newConnection = (
  weight: number = 0.5,
): Connection => {
  return {
    weight,
  };
}

export const newRandomConnection = (): Connection => {
  return {
    weight: Math.random(),
  };
}

export const connect = (
  n1: Neuron,
  connection: Connection,
  n2: Neuron,
): void => {

  n1.right.set(n2, connection);
  n2.left.set(n1, connection);
}