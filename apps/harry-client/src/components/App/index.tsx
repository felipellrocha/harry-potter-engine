import React, { Component } from 'react';

import Plot from 'components/graphs/Plot';

import { Body } from './styles.emo';

class App extends Component {
  render() {
    return (
      <Body>
        <Plot
          data={[0, 1, 2, 3, 4, 5]}
          height={300}
          width={600}
        />
      </Body>
    );
  }
}

export default App;
