import React from 'react';

import { Graph } from './styles.emo';

type Props = {
  xRange: d3.ScaleLinear<number, number>,
  yRange: d3.ScaleLinear<number, number>,
  padding: {
    top: number,
    right: number,
    bottom: number,
    left: number,
  },
  height: number,
  width: number,
};

class Grid extends React.Component<Props, {}> {

  static defaultProps = {
    padding: {
      top: 20,
      right: 20,
      bottom: 50,
      left: 50,
    },
  }

  render() {
    const {
      yRange,
      xRange,
      width,
      height,
      padding: {
        left,
      }
    } = this.props;

    const ticks = yRange.ticks(10);

    const [_, domain] = xRange.domain();
    const [yMin, yMax] = yRange.range();

    return (
      <Graph className="grid">
        <g className="ticks">
          {ticks.map((tick, i) => (
            <text
              key={i}
              x={left}
              dx={-5}
              y={yRange(tick)}
            >
              {tick}
            </text>
          ))}
          {ticks.map((tick, i) => (
            <line
              key={i}
              x1={left}
              x2={width}
              y1={yRange(tick)}
              y2={yRange(tick)}
            />
          ))}
        </g>
        <g className="axis">
          <line
            x1={left}
            x2={left}
            y1={yMax}
            y2={yMin}
          />
          <line
            x1={left}
            x2={width}
            y1={yRange(0)}
            y2={yRange(0)}
          />
        </g>
      </Graph>
    )
  }
}

export default Grid;