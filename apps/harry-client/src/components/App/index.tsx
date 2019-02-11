import React, { Component } from 'react';

import { debounce } from 'lodash';

import Plot from 'components/graphs/Plot';
import Canvas from 'components/graphs/Canvas';
import Line from 'components/graphs/Line';
import Sankey from 'components/graphs/Sankey';

import { Body } from './styles.emo';
import { newNetwork, Network } from '@hp/dumbledore';
import { randomElement } from 'utils';
import { values } from 'd3';


class App extends Component {
  state = {
    speed: 75,
    resolution: 100,
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
    learningRate: .05,
  });

  timer: NodeJS.Timeout | null;

  learn = () => {
    const { data, error } = this.state;

    const newData = data.map((element, index) => {
      //console.log(`learning ${element}`);
      this.network.learn(element.input, element.expected);
      /*
      console.table({
        index: [index, '-----'],
        ...this.network.inspect(),
        expected: element.expected,
      });
      */

      this.update();
      return {
        ...element,
        guess: this.network.output(),
      };
    });
  }

  toggleRandom = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    } else {
      this.timer = setInterval(this.randomAndUpdate, this.state.speed);
    }
  }

  toggleLearn = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    } else {
      this.timer = setInterval(this.learn, this.state.speed);
    }
  }

  update = () => {
    const { data, error, predictions } = this.state;

    const newData = data.map((element, index) => {
      this.network.predict(element.input);

      return {
        ...element,
        guess: this.network.output(),
      };
    });

    const state = this.network.inspect();

    const pred = (predictions.length > 150) ?
      [...predictions.slice(1), ...state.outputs] :
      [...predictions, ...state.outputs];

    const err = (error.length > 150) ?
      [...error.slice(1), state.error] :
      [...error, state.error];

    this.setState({
      predictions: pred,
      error: err,
      data: newData,
    });
  }

  random = () => {
    const { data } = this.state;

    const [_, element] = randomElement(data);
    //console.log(`training: ${element.input} -> ${element.expected}`)
    this.network.learn(element.input, element.expected);
    //console.log(`output: ${this.network.output().map(v => v.toFixed(4))} error: ${this.network.error.toFixed(4)}`);
    //console.log(`trained: ${element.input} -> ${element.expected}`)
  }

  randomAndUpdate = () => {
    this.random();
    this.update();
  }

  train = () => {
    console.log('training...')
    //for (let i = 0; i < 10000; i++) {
    for (let i = 0; i < 50000; i++) this.random();
    this.learn();
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
        <button onClick={debounce(() => { this.learn() }, 200)}> Learn</button>
        <button onClick={this.toggleLearn}>Auto Learn</button>
        <button onClick={debounce(() => { this.randomAndUpdate() }, 200)}> Random</button>
        <button onClick={this.toggleRandom}>Auto Random</button>
        <button onClick={this.test}>Test</button>
        Speed: <input type="number" value={this.state.speed} onChange={(e) => this.handleSpeedChange(e.target.value)} />
      </div>
    );
  }

  render() {
    //console.log(this.network.getRepresentation());
    const { resolution } = this.state;

    const predictions = [];

    for (var i = 0; i < resolution; i++) {
      for (var j = 0; j < resolution; j++) {
        const x1 = i / resolution;
        const x2 = j / resolution;
        const inputs = [x1, x2];

        predictions.push(this.network.predict(inputs)[0]);
      }
    }

    return (
      <Body>
        <h1>Data</h1>
        <Plot
          height={300}
          width={600}
          data={this.state.data}
        />
        <this.renderButtons />
        <h1>Network</h1>
        <Sankey
          height={500}
          width={600}
          data={this.network.getRepresentation()}
        />
        <this.renderButtons />
        {/*
        */}
        <h1>Error</h1>
        <Line
          height={300}
          width={600}
          data={this.state.error}
        />
        <this.renderButtons />
        <h1>Predictions</h1>
        <Line
          height={300}
          width={600}
          data={this.state.predictions}
        />
        <this.renderButtons />
        <h1>Canvas</h1>
        <Canvas
          data={predictions}
        />
        <this.renderButtons />
      </Body>
    );
  }
}

export default App;
