import React from 'react';
import * as d3 from 'd3';

import { Graph } from './styles.emo';
import { Line, Data } from 'types';
import Grid from 'components/graphs/Grid';
import { number } from 'prop-types';

type Props = {
  data: Data[],
  padding: {
    top: number,
    right: number,
    bottom: number,
    left: number,
  },
  height: number,
  width: number,
  onClick(Point): void,
};

const getX = (data: Data): number => data.input[0];
const getY = (data: Data): number => data.input[1];
const calculateError = (data: Data): number => data.expected.map((_, i) => {
  // calculate diff
  const expect = data.expected[i];
  const guess = data.guess[i];

  return expect - guess;
}).reduce((prev, curr) => {
  return prev + curr;
}, 0);

class Plot extends React.Component<Props, {}> {
  xRange: d3.ScaleLinear<number, number>;
  yRange: d3.ScaleLinear<number, number>;
  colorRange: d3.ScaleLinear<number, string>;

  static defaultProps = {
    padding: {
      top: 20,
      right: 20,
      bottom: 50,
      left: 50,
    },
    onClick: () => { },
  }

  componentWillMount() {
    this.updateData();
  }

  componentWillReceiveProps() {
    this.updateData();
  }

  updateData = () => {
    const { data, padding: { top, left } } = this.props;

    const [_, xMax] = d3.extent<Data, number>(data, item => getX(item));
    const [__, yMax] = d3.extent<Data, number>(data, item => getY(item));

    this.xRange = d3
      .scaleLinear()
      .domain([0, xMax])
      .range([left, this.width + left]);

    this.yRange = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([this.height + top, top]);

    this.colorRange = d3
      .scaleLinear()
      .domain([0, 1])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#0f0"), d3.rgb('#f00')]);
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

  handleClick = (event) => {
    const point = {
      x: this.xRange.invert(event.clientX),
      y: this.yRange.invert(event.clientY),
    };

    this.props.onClick(point);
  }

  render() {
    const {
      data,
      width,
      height,
      padding: {
        left,
      }
    } = this.props;

    const ticks = this.yRange.ticks(10);

    const [_, domain] = this.xRange.domain();

    return (
      <Graph>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width, height }}
          onClick={this.handleClick}
        >
          <Grid
            yRange={this.yRange}
            xRange={this.xRange}
            width={this.width}
            height={this.height}
            padding={this.props.padding}
          />
          <g className="data">
            {data.map((point, i) => (
              <circle
                key={i}
                cx={this.xRange(getX(point))}
                cy={this.yRange(getY(point))}
                r={3}
                fill={this.colorRange(calculateError(point))}
              />
            ))}
          </g>
        </svg>
      </Graph>
    );
  }
}

export default Plot;
