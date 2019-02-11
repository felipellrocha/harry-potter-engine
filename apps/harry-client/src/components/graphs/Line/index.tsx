import React from 'react';
import * as d3 from 'd3';

import { Graph } from './styles.emo';
import Grid from 'components/graphs/Grid';

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
  onClick(Point): void,
};

class Plot extends React.Component<Props, {}> {
  xRange: d3.ScaleLinear<number, number>;
  yRange: d3.ScaleLinear<number, number>;

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

    const [yMin, yMax] = d3.extent<number, number>(data, item => item);

    this.xRange = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([left, this.width + left]);

    this.yRange = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([this.height + top, top]);
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
                cx={this.xRange(i)}
                cy={this.yRange(point)}
                r={2}
              />
            ))}
          </g>
        </svg>
      </Graph>
    );
  }
}

export default Plot;
