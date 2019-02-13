/* Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

/**
 * A node in a neural network. Each node has a state
 * (total input, output, and their respectively derivatives) which changes
 * after every forward and back propagation run.
 */
export class Node {
  id: string;
  /** List of input links. */
  inputLinks: Link[] = [];
  bias = 0.1;
  /** List of output links. */
  outputs: Link[] = [];
  totalInput: number;
  output: number;
  /** Error derivative with respect to this node's output. */
  outputDer = 0;
  /** Error derivative with respect to this node's total input. */
  inputDer = 0;
  /**
   * Accumulated error derivative with respect to this node's total input since
   * the last update. This derivative equals dE/db where b is the node's
   * bias term.
   */
  accInputDer = 0;
  /**
   * Number of accumulated err. derivatives with respect to the total input
   * since the last update.
   */
  numAccumulatedDers = 0;
  /** Activation function that takes total input and returns node's output */
  activation: ActivationFunction;

  /**
   * Creates a new node with the provided id and activation function.
   */
  constructor(id: string, activation: ActivationFunction, initZero?: boolean) {
    this.id = id;
    this.activation = activation;
    if (initZero) {
      this.bias = 0;
    }
  }

  /** Recomputes the node's output and returns it. */
  updateOutput(): number {
    // Stores total input into the node.
    this.totalInput = this.bias;
    for (let j = 0; j < this.inputLinks.length; j++) {
      let link = this.inputLinks[j];
      this.totalInput += link.weight * link.source.output;
      //console.log(`${link.id}: ${link.weight} * ${link.source.output} = ${link.weight * link.source.output}`)
    }
    this.output = this.activation.output(this.totalInput);
    //console.log(`b: ${this.bias} total: ${this.totalInput} out: ${this.output}\n\n`);
    return this.output;
  }
}

/**
 * An error function and its derivative.
 */
export interface ErrorFunction {
  error: (output: number, target: number) => number;
  der: (output: number, target: number) => number;
}

/** A node's activation function and its derivative. */
export interface ActivationFunction {
  output: (input: number) => number;
  der: (input: number) => number;
}

/** Function that computes a penalty cost for a given weight in the network. */
export interface RegularizationFunction {
  output: (weight: number) => number;
  der: (weight: number) => number;
}

/** Built-in error functions */
export class Errors {
  public static SQUARE: ErrorFunction = {
    error: (output: number, target: number) =>
      0.5 * Math.pow(output - target, 2),
    der: (output: number, target: number) => output - target
  };
}

/** Polyfill for TANH */
(Math as any).tanh = (Math as any).tanh || function (x: any) {
  if (x === Infinity) {
    return 1;
  } else if (x === -Infinity) {
    return -1;
  } else {
    let e2x = Math.exp(2 * x);
    return (e2x - 1) / (e2x + 1);
  }
};

/** Built-in activation functions */
export class Activations {
  public static TANH: ActivationFunction = {
    output: x => (Math as any).tanh(x),
    der: x => {
      let output = Activations.TANH.output(x);
      return 1 - output * output;
    }
  };
  public static RELU: ActivationFunction = {
    output: x => Math.max(0, x),
    der: x => x <= 0 ? 0 : 1
  };
  public static SIGMOID: ActivationFunction = {
    output: x => 1 / (1 + Math.exp(-x)),
    der: x => {
      let output = Activations.SIGMOID.output(x);
      return output * (1 - output);
    }
  };
  public static LINEAR: ActivationFunction = {
    output: x => x,
    der: x => 1
  };
}

/** Build-in regularization functions */
export class RegularizationFunction {
  public static L1: RegularizationFunction = {
    output: w => Math.abs(w),
    der: w => w < 0 ? -1 : (w > 0 ? 1 : 0)
  };
  public static L2: RegularizationFunction = {
    output: w => 0.5 * w * w,
    der: w => w
  };
}

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

// Takes any integer
function seed(i: number) {
  m_w = (123456789 + i) & mask;
  m_z = (987654321 - i) & mask;
}

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
function random() {
  m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
  m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
  var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
  result /= 4294967296;
  return result;
}

seed(2);

/**
 * A link in a neural network. Each link has a weight and a source and
 * destination node. Also it has an internal state (error derivative
 * with respect to a particular input) which gets updated after
 * a run of back propagation.
 */
export class Link {
  id: string;
  source: Node;
  dest: Node;
  weight = random() - 0.5;
  isDead = false;
  /** Error derivative with respect to this weight. */
  errorDer = 0;
  /** Accumulated error derivative since the last update. */
  accErrorDer = 0;
  /** Number of accumulated derivatives since the last update. */
  numAccumulatedDers = 0;
  regularization: RegularizationFunction;

  /**
   * Constructs a link in the neural network initialized with random weight.
   *
   * @param source The source node.
   * @param dest The destination node.
   * @param regularization The regularization function that computes the
   *     penalty for this weight. If null, there will be no regularization.
   */
  constructor(source: Node, dest: Node,
    regularization: RegularizationFunction, initZero?: boolean) {
    this.id = source.id + "-" + dest.id;
    this.source = source;
    this.dest = dest;
    this.regularization = regularization;
    if (initZero) {
      this.weight = 0;
    }
  }
}

/**
 * Builds a neural network.
 *
 * @param networkShape The shape of the network. E.g. [1, 2, 3, 1] means
 *   the network will have one input node, 2 nodes in first hidden layer,
 *   3 nodes in second hidden layer and 1 output node.
 * @param activation The activation function of every hidden node.
 * @param outputActivation The activation function for the output nodes.
 * @param regularization The regularization function that computes a penalty
 *     for a given weight (parameter) in the network. If null, there will be
 *     no regularization.
 * @param inputIds List of ids for the input nodes.
 */
export function buildNetwork(
  networkShape: number[], activation: ActivationFunction,
  outputActivation: ActivationFunction,
  regularization: RegularizationFunction,
  inputIds: string[], initZero?: boolean): Node[][] {
  let numLayers = networkShape.length;
  let id = 1;
  /** List of layers, with each layer being a list of nodes. */
  let network: Node[][] = [];
  for (let layerIdx = 0; layerIdx < numLayers; layerIdx++) {
    let isOutputLayer = layerIdx === numLayers - 1;
    let isInputLayer = layerIdx === 0;
    let currentLayer: Node[] = [];
    network.push(currentLayer);
    let numNodes = networkShape[layerIdx];
    for (let i = 0; i < numNodes; i++) {
      let nodeId = id.toString();
      if (isInputLayer) {
        nodeId = inputIds[i];
      } else {
        id++;
      }
      let node = new Node(nodeId,
        isOutputLayer ? outputActivation : activation, initZero);
      currentLayer.push(node);
      if (layerIdx >= 1) {
        // Add links from nodes in the previous layer to this node.
        for (let j = 0; j < network[layerIdx - 1].length; j++) {
          let prevNode = network[layerIdx - 1][j];
          let link = new Link(prevNode, node, regularization, initZero);
          prevNode.outputs.push(link);
          node.inputLinks.push(link);
        }
      }
    }
  }
  return network;
}

/**
 * Runs a forward propagation of the provided input through the provided
 * network. This method modifies the internal state of the network - the
 * total input and output of each node in the network.
 *
 * @param network The neural network.
 * @param inputs The input array. Its length should match the number of input
 *     nodes in the network.
 * @return The final output of the network.
 */
export function forwardProp(network: Node[][], inputs: number[]): number {
  let inputLayer = network[0];
  if (inputs.length !== inputLayer.length) {
    throw new Error("The number of inputs must match the number of nodes in" +
      " the input layer");
  }
  // Update the input layer.
  for (let i = 0; i < inputLayer.length; i++) {
    let node = inputLayer[i];
    node.output = inputs[i];
  }
  for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
    let currentLayer = network[layerIdx];
    // Update all the nodes in this layer.
    for (let i = 0; i < currentLayer.length; i++) {
      let node = currentLayer[i];
      node.updateOutput();
    }
  }
  return network[network.length - 1][0].output;
}

/**
 * Runs a backward propagation using the provided target and the
 * computed output of the previous call to forward propagation.
 * This method modifies the internal state of the network - the error
 * derivatives with respect to each node, and each weight
 * in the network.
 */
export function backProp(network: Node[][], target: number,
  errorFunc: ErrorFunction): void {
  // The output node is a special case. We use the user-defined error
  // function for the derivative.
  let outputNode = network[network.length - 1][0];
  outputNode.outputDer = errorFunc.der(outputNode.output, target);
  //console.log('output der', outputNode.outputDer)

  // Go through the layers backwards.
  for (let layerIdx = network.length - 1; layerIdx >= 1; layerIdx--) {
    let currentLayer = network[layerIdx];
    // Compute the error derivative of each node with respect to:
    // 1) its total input
    // 2) each of its input weights.
    for (let i = 0; i < currentLayer.length; i++) {
      let node = currentLayer[i];
      node.inputDer = node.outputDer * node.activation.der(node.totalInput);
      console.log(`bp ${node.id}: ${node.inputDer}`)
      node.accInputDer += node.inputDer;
      node.numAccumulatedDers++;
    }

    // Error derivative with respect to each weight coming into the node.
    for (let i = 0; i < currentLayer.length; i++) {
      let node = currentLayer[i];
      for (let j = 0; j < node.inputLinks.length; j++) {
        let link = node.inputLinks[j];
        if (link.isDead) {
          continue;
        }
        link.errorDer = node.inputDer * link.source.output;
        link.accErrorDer += link.errorDer;
        link.numAccumulatedDers++;
      }
    }
    if (layerIdx === 1) {
      continue;
    }
    let prevLayer = network[layerIdx - 1];
    for (let i = 0; i < prevLayer.length; i++) {
      let node = prevLayer[i];
      // Compute the error derivative with respect to each node's output.
      node.outputDer = 0;
      for (let j = 0; j < node.outputs.length; j++) {
        let output = node.outputs[j];
        node.outputDer += output.weight * output.dest.inputDer;
      }
    }
  }
}

/**
 * Updates the weights of the network using the previously accumulated error
 * derivatives.
 */
export function updateWeights(network: Node[][], learningRate: number,
  regularizationRate: number) {
  for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
    let currentLayer = network[layerIdx];
    for (let i = 0; i < currentLayer.length; i++) {
      let node = currentLayer[i];
      // Update the node's bias.
      if (node.numAccumulatedDers > 0) {
        const b = node.bias;
        node.bias -= learningRate * node.accInputDer / node.numAccumulatedDers;
        console.log(`(b) ${node.id} weight: ${node.bias} == ${b} - ${node.accInputDer}`)
        node.accInputDer = 0;
        node.numAccumulatedDers = 0;
      }
      // Update the weights coming into this node.
      for (let j = 0; j < node.inputLinks.length; j++) {
        let link = node.inputLinks[j];
        if (link.isDead) {
          continue;
        }
        let regulDer = link.regularization ?
          link.regularization.der(link.weight) : 0;
        if (link.numAccumulatedDers > 0) {
          // Update the weight based on dE/dw.
          const lw = link.weight;
          link.weight = link.weight -
            (learningRate / link.numAccumulatedDers) * link.accErrorDer;
          console.log(`${link.id} weight: ${link.weight} == ${lw} - ${link.accErrorDer}`)
          // Further update the weight based on regularization.
          let newLinkWeight = link.weight -
            (learningRate * regularizationRate) * regulDer;
          if (link.regularization === RegularizationFunction.L1 &&
            link.weight * newLinkWeight < 0) {
            // The weight crossed 0 due to the regularization term. Set it to 0.
            link.weight = 0;
            link.isDead = true;
          } else {
            link.weight = newLinkWeight;
          }
          link.accErrorDer = 0;
          link.numAccumulatedDers = 0;
        }
      }
    }
  }
}

/** Iterates over every node in the network/ */
export function forEachNode(network: Node[][], ignoreInputs: boolean,
  accessor: (node: Node) => any) {
  for (let layerIdx = ignoreInputs ? 1 : 0;
    layerIdx < network.length;
    layerIdx++) {
    let currentLayer = network[layerIdx];
    for (let i = 0; i < currentLayer.length; i++) {
      let node = currentLayer[i];
      accessor(node);
    }
  }
}

export function forEachLink(network: Node[][], accessor: (link: Link) => any) {
  for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
    let currentLayer = network[layerIdx];
    for (let i = 0; i < currentLayer.length; i++) {
      let node = currentLayer[i];
      for (let j = 0; j < node.inputLinks.length; j++) {
        let link = node.inputLinks[j];
        accessor(link);
      }
    }
  }
}

/** Returns the output node in the network. */
export function getOutputNode(network: Node[][]) {
  return network[network.length - 1][0];
}

const nn = buildNetwork(
  [2, 2, 1],
  Activations.SIGMOID,
  Activations.SIGMOID,
  null,
  ['i1', 'i2'],
)

//console.log(nn);
forwardProp(nn, [1, 0]);
backProp(nn, 1, Errors.SQUARE);
updateWeights(nn, 1, 1);
const out = forwardProp(nn, [1, 0]);
/*
console.log('outputs');
forEachNode(nn, false, n => {
  console.log(n.id, n.output);
})
console.log('links');
forEachLink(nn, l => {
  //console.log(l.id, l.weight);
  console.log(`${l.weight},`);
})
forEachNode(nn, false, n => {
  //console.log(n.id, n.bias);
  console.log(`${n.bias},`);
})
*/

console.log(out);
backProp(nn, 1, Errors.SQUARE);
updateWeights(nn, 1, 1);
/*
console.log('\n--------------\n');
console.log('outputs');
forEachNode(nn, false, n => {
  console.log(n.id, n.output);
})
console.log('outputs');
forEachNode(nn, false, n => {
  console.log(n.id, n.output);
})
console.log('links');
forEachLink(nn, l => {
  console.log(`${l.weight},`);
})
forEachNode(nn, false, n => {
  //console.log(n.id, n.bias);
  console.log(`${n.bias},`);
})
*/

/*
i1-1: -0.3334561549171228 * 1 = -0.3334561549171228
i2-1: 0.26483230385929346 * 0 = 0
b: 0.09835943174107184 out: 0.44149503769993126


i1-2: -0.33819130497979666 * 1 = -0.33819130497979666
i2-2: -0.2775839751120657 * 0 = 0
b: 0.10962333528329887 out: 0.4431054886671991


1-3: -0.012562458245290453 * 0.44149503769993126 = -0.005546262976608321
2-3: 0.405689997406255 * 0.4431054886671991 = 0.17976346454809336
b: 0.20924296391779496 out: 0.594707380956806


outputs
i1 1
i2 0
1 0.44149503769993126
2 0.4431054886671991
3 0.594707380956806
links
-0.3334561549171228,
0.26483230385929346,
-0.33819130497979666,
-0.2775839751120657,
-0.012562458245290453,
0.405689997406255,
0.1,
0.1,
0.09835943174107184,
0.10962333528329887,
0.20924296391779496,
bp 3: -0.09768788747468224
bp 1: 0.0003025995041130864
bp 2: -0.009779464738716426
weight: -0.3337587544212359 = -0.3334561549171228 - 0.0003025995041130864
weight: 0.26483230385929346 = 0.26483230385929346 - 0
weight: -0.3284118402410802 = -0.33819130497979666 - -0.009779464738716426
weight: -0.2775839751120657 = -0.2775839751120657 - 0
weight: 0.030566259318171023 = -0.012562458245290453 - -0.043128717563461476
weight: 0.44897603652259044 = 0.405689997406255 - -0.04328603911633543

--------------

0.594707380956806

--------------

outputs
i1 1
i2 0
1 0.44149503769993126
2 0.4431054886671991
3 0.594707380956806
outputs
i1 1
i2 0
1 0.44149503769993126
2 0.4431054886671991
3 0.594707380956806
links
-0.3337587544212359,
0.26483230385929346,
-0.3284118402410802,
-0.2775839751120657,
0.030566259318171023,
0.44897603652259044,
0.1,
0.1,
0.09805683223695875,
0.1194028000220153,
0.3069308513924772,
*/