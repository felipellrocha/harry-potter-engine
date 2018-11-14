import React, { Component } from 'react';

import Plot from 'components/graphs/Plot';
import Line from 'components/graphs/Line';
import Sankey from 'components/graphs/Sankey';

import { Body } from './styles.emo';
import { newNetwork, Network } from '@hp/dumbledore';
import { randomElement } from 'utils';


class App extends Component {
  state = {
    data: [
      {
        input: [0, 1],
        expected: [0],
        guess: [.5],
      },
      {
        input: [1, 0],
        expected: [1],
        guess: [.5],
      },
      {
        input: [1, 1],
        expected: [0],
        guess: [.5],
      },
      {
        input: [0, 0],
        expected: [0],
        guess: [.5],
      },
    ],
    error: [0],
  };

  network: Network = newNetwork([2, 2, 1], .5);

  timer: NodeJS.Timeout | null;

  learn = () => {
    const { data, error } = this.state;

    const newData = data.map((element, index) => {
      this.network.learn(element.input, element.expected);
      console.table({
        index: [index, '-----'],
        ...this.network.inspect(),
        expected: element.expected,
      });
      /*
      */

      return {
        ...element,
        guess: this.network.output(),
      };
    });

    const state = this.network.inspect();
    const err = (error.length > 150) ?
      [...error.slice(1), state.error] :
      [...error, state.error];

    this.setState({
      error: err,
      data: newData,
    });
  }

  toggleLearn = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    } else {
      this.timer = setInterval(this.learn, 75);
    }
  }

  train = () => {
    const { data } = this.state;

    console.log('training...')
    //for (let i = 0; i < 10000; i++) {
    for (let i = 0; i < 1000; i++) {
      const [index, element] = randomElement(data);
      this.network.learn(element.input, element.expected);
      console.table({
        index: [index, '-----'],
        ...this.network.inspect(),
        expected: element.expected,
      });
    }
    console.log('done.')
  }

  test = () => {
    console.log(this.network.predict([0, 0]));
    console.log(this.network.predict([0, 1]));
    console.log(this.network.predict([1, 0]));
    console.log(this.network.predict([1, 1]));
  }

  render() {
    //console.log(this.network.getRepresentation());
    return (
      <Body>
        <h1>Data</h1>
        <Plot
          height={300}
          width={600}
          data={this.state.data}
        />
        <h1>Network</h1>
        <Sankey
          height={500}
          width={700}
          data={this.network.getRepresentation()}
        />
        <button onClick={this.learn}>Learn</button>
        <button onClick={this.toggleLearn}>Auto Learn</button>
        <button onClick={this.test}>Test</button>
        <button onClick={this.train}>Train</button>
        <h1>Error</h1>
        <Line
          height={300}
          width={900}
          data={this.state.error}
        />
      </Body>
    );
  }
}

export default App;
