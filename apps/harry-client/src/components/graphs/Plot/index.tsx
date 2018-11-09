import React from 'react';
import * as d3 from 'd3';

import { Graph } from './styles.emo';

type Point = {
  id: string,
  x: number,
  y: number,
};

type Props = {
  learn: {
    m: number,
    b: number,
  },
  data: Point[],
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

type Line = {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}

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

  constructor(props) {
    super(props);

    const { data, padding: { top, left } } = props;

    const [_, xMax] = d3.extent<Point, number>(data, item => item.x);
    const [__, yMax] = d3.extent<Point, number>(data, item => item.y);

    this.xRange = d3
      .scaleLinear()
      .domain([0, xMax])
      .range([left, this.width + left]);

    this.yRange = d3
      .scaleLinear()
      .domain([0, yMax])
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

  drawLine = (m: number, b: number, x1: number, x2: number): Line => {
    const y1 = m * x1 + b;
    const y2 = m * x2 + b;

    return {
      x1: this.xRange(x1),
      y1: this.yRange(y1),
      x2: this.xRange(x2),
      y2: this.yRange(y2)
    };
  }

  render() {
    const {
      learn: {
        m,
        b,
      },
      data,
      width,
      height,
      padding: {
        left,
      }
    } = this.props;

    const ticks = this.yRange.ticks(10);

    const [_, domain] = this.xRange.domain();
    const bestFit = this.drawLine(m, b, 0, domain);

    return (
      <Graph>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width, height }}
          onClick={this.handleClick}
        >
          <g className="ticks">
            {ticks.map((tick, i) => (
              <line
                key={i}
                x1={left}
                x2={width}
                y1={this.yRange(tick)}
                y2={this.yRange(tick)}
              />
            ))}
          </g>
          <g className="axis">
            <line
              x1={left}
              x2={left}
              y1={0}
              y2={this.yRange(0)}
            />
            <line
              x1={left}
              x2={width}
              y1={this.yRange(0)}
              y2={this.yRange(0)}
            />
          </g>
          <g className="best-fit">
            <line
              {...bestFit}
            />
          </g>
          <g className="data">
            {data.map((point, i) => (
              <circle
                key={point.id}
                cx={this.xRange(point.x)}
                cy={this.yRange(point.y)}
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
