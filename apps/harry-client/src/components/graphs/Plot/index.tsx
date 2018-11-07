import React from 'react';
import * as d3 from 'd3';

import { Graph } from './styles.emo';


type Props = {
  data: number[],
  padding: {
    top: number,
    right: number,
    bottom: number,
    left: number,
  },
  height: number,
  width: number,
};

class Plot extends React.Component<Props, {}> {
  xRange: d3.ScaleLinear<number, number>;
  yRange: d3.ScaleLinear<number, number>;

  static defaultProps = {
    padding: {
      top: 20,
      right: 20,
      bottom: 50,
      left: 100,
    },
  }

  constructor(props) {
    super(props);

    const { data } = props;

    const [_, max] = d3.extent<number>(data);

    this.xRange = d3
      .scaleLinear()
      .domain([0, max])
      .range([0, this.width]);

    this.yRange = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([this.height, 0]);
  }

  get width() {
    const {
      width,
      padding: {
        left,
        right,
      }
    } = this.props;

    return width - (left + right);
  }

  get height() {
    const {
      height,
      padding: {
        top,
        bottom,
      }
    } = this.props;

    return height - (top + bottom);
  }

  render() {
    const {
      data,
      width,
      height,
      padding: {
        top,
        left,
      }
    } = this.props;

    const ticks = this.yRange.ticks(10);

    return (
      <Graph>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width, height }}
        >
          <g className="ticks">
            {ticks.map((tick, i) => (
              <line
                x1={left}
                x2={width}
                y1={this.yRange(tick) + top}
                y2={this.yRange(tick) + top}
              />
            ))}
          </g>
          <g className="data">
            {data.map((point, i) => (
              <circle
                key={i}
                cx={this.xRange(i) + left}
                cy={this.yRange(point) + top}
                r={5}
              />
            ))}
          </g>
          <g className="axis">
            <line
              x1={left}
              x2={left}
              y1={0}
              y2={height - top}
            />
            <line
              x1={left}
              x2={width}
              y1={height - top}
              y2={height - top}
            />
          </g>
        </svg>
      </Graph>
    );
  }
}

export default Plot;
