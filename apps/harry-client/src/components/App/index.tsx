import React, { Component } from 'react';

import Plot from 'components/graphs/Plot';

import { Body } from './styles.emo';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4();
}

class App extends Component {
  state = {
    learn: {
      m: 0,
      b: 0,
      r: 0.001,
    },
    data: [
      { id: "a", x: 5, y: 10 },
      { id: "b", x: 10, y: 5 },
      { id: "c", x: 10, y: 7 },
    ],
  }

  timer: NodeJS.Timeout | null;

  descent = () => {
    const {
      learn: {
        m,
        b,
        r,
      },
      data,
    } = this.state;

    let mPrime = m;
    let bPrime = b;

    for (let { x, y } of data) {
      const guess = m * x + b;

      const error = (y - guess);

      mPrime = mPrime + (error * x) * r;
      bPrime = bPrime + (error) * r;
    }

    const learn = {
      m: mPrime,
      b: bPrime,
      r,
    }

    this.setState({ learn })
  }

  addPoint = (point) => {
    const data = [
      ...this.state.data,
      { ...point, id: guid() },
    ];

    this.setState({ data })
  }

  toggleLearn = () => {
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(this.descent, 50);
    }
  }

  render() {
    return (
      <Body>
        <Plot
          height={300}
          width={600}
          onClick={this.addPoint}
          {...this.state}
        />
        <button onClick={this.toggleLearn}>Learn</button>
      </Body>
    );
  }
}

export default App;
