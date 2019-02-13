import React, { Component } from 'react';

import { debounce } from 'lodash';

import Plot from 'components/graphs/Plot';
import Canvas from 'components/graphs/Canvas';
import Line from 'components/graphs/Line';
import Sankey from 'components/graphs/Sankey';

import { Body, Block } from './styles.emo';
import { newNetwork, Network } from '@hp/dumbledore';
import { randomElement } from 'utils';
import { values } from 'd3';


class App extends Component {
  state = {
    speed: 75,
    resolution: 100,
    count: 0,
    data: [
      /*
      */
      {
        input: [0, 0],
        expected: [0],
        guess: [.2],
      },
      {
        input: [1, 1],
        expected: [0],
        guess: [.7],
      },
      {
        input: [0, 1],
        expected: [1],
        guess: [.2],
      },
      {
        input: [1, 0],
        expected: [1],
        guess: [.7],
      },
    ],
    predictions: [0],
    error: [0],
  };

  network: Network = newNetwork([2, 2, 1], {
    learningRate: .1,
  });

  timer: NodeJS.Timeout | null;

  toggleRandom = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    } else {
      this.timer = setInterval(this.randomAndUpdate, this.state.speed);
    }
  }

  update = () => {
    const { count, data, error, predictions } = this.state;

    const state = this.network.inspect();

    const pred = (predictions.length > 150) ?
      [...predictions.slice(1), ...state.outputs] :
      [...predictions, ...state.outputs];

    const err = (error.length > 150) ?
      [...error.slice(1), state.error] :
      [...error, state.error];

    const newData = data.map((element, index) => {
      const guess = this.network.predict(element.input);

      return {
        ...element,
        guess,
      };
    });

    this.setState({
      predictions: pred,
      count: count + 1,
      error: err,
      data: newData,
    });
  }

  random = () => {
    const { data } = this.state;

    const [_, element] = randomElement(data);
    this.network.learn(element.input, element.expected);
  }

  randomAndUpdate = () => {
    this.random();
    this.update();
  }

  train = () => {
    console.log('training...')
    //for (let i = 0; i < 10000; i++) {
    for (let i = 0; i < 5000; i++) this.random();
    this.random();
    console.log('done.')
  }

  test = () => {
    console.log(this.network.predict([0, 0]));
    console.log(this.network.predict([0, 1]));
    console.log(this.network.predict([1, 0]));
    console.log(this.network.predict([1, 1]));
  }

  handleSpeedChange = (speed) => {
    this.setState({
      speed,
    })
  }

  renderButtons = () => {
    return (
      <div>
        <button onClick={this.train}>Train</button>
        <button onClick={debounce(() => { this.randomAndUpdate() }, 200)}> Random</button>
        <button onClick={this.toggleRandom}>Auto Random</button>
        <button onClick={this.test}>Test</button>
        Speed: <input type="number" value={this.state.speed} onChange={(e) => this.handleSpeedChange(e.target.value)} />
      </div>
    );
  }

  render() {
    const { count, error, predictions, data, resolution } = this.state;

    const heatmap = [];

    for (var i = 0; i < resolution; i++) {
      for (var j = 0; j < resolution; j++) {
        const x1 = i / resolution;
        const x2 = j / resolution;
        const inputs = [x1, x2];

        heatmap.push(this.network.predict(inputs)[0]);
      }
    }

    return (
      <Body>
        <Block>
          <div>Count: {count}</div>
          <h1>Canvas</h1>
          <Canvas
            data={heatmap}
          />
          <this.renderButtons />
        </Block>
        <Block>
          <h1>Network</h1>
          <Sankey
            height={300}
            width={600}
            data={this.network.getRepresentation()}
          />
          <this.renderButtons />
        </Block>
        <Block>
          <h1>Error</h1>
          <Line
            height={300}
            width={600}
            data={error}
          />
          <this.renderButtons />
        </Block>
        <Block>
          <h1>Predictions</h1>
          <Line
            height={300}
            width={600}
            data={predictions}
          />
          <this.renderButtons />
        </Block>
        <Block>
          <h1>Data</h1>
          <Plot
            height={300}
            width={600}
            data={data}
          />
          <this.renderButtons />
        </Block>
      </Body>
    );
  }
}

export default App;
