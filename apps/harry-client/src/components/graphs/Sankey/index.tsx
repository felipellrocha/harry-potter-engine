import React from 'react';
import classnames from 'classnames';
import { sankey, sankeyJustify, sankeyLinkHorizontal } from 'd3-sankey';
import { Representation } from '@hp/dumbledore';
import { Graph, Stats, Stat } from './styles.emo';

type Props = {
  data: any,
  padding: {
    top: number,
    right: number,
    bottom: number,
    left: number,
  },
  height: number,
  width: number,
};

type State = {
  node: {
    id: string;
  },
  link: {
    index: number;
    id1: string;
    id2: string;
    weight: number;
  }
};


class Sankey extends React.Component<Props, State> {
  sankey = sankey<Representation, {}, {}>();

  static defaultProps = {
    padding: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
  }

  state = {
    node: {
      id: 'BIAS',
      value: 1,
      error: 0,
    },
    link: {
      index: 0,
      id1: '---',
      id2: '---',
      weight: .5,
    }
  };

  componentWillMount() {
    this.updateData();
  }

  componentWillReceiveProps() {
    this.updateData();
  }

  updateData = () => {
    const {
      data,
    } = this.props;

    this.sankey
      .nodeWidth(36)
      .nodePadding(10)
      // @ts-ignore
      .nodeId(function (node) { return node.name; })
      .size([this.width, this.height])
      .nodeAlign(sankeyJustify);
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

  handleConnection = (d) => {
    this.setState({
      link: {
        index: d.index,
        weight: d.value,
        id1: d.source.name,
        id2: d.target.name,
      }
    });
  }

  handleNode = (d) => {
    this.setState({
      node: d
    });
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

    const {
      node: {
        id,
        a,
        error,
      },
      link: {
        index,
        weight,
        id1,
        id2,
      }
    } = this.state;

    //const path = this.sankey.sankeyLinkHorizontal();
    const graph = this.sankey(data);
    const link = sankeyLinkHorizontal();

    return (
      <Graph>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width, height }}
        >
          <g className="links">
            {graph.links.map(d => (
              <path
                key={d.index}
                d={link(d)}
                className={classnames({
                  highlight: d.index === index,
                })}
                strokeWidth={d.width}
                onMouseEnter={() => this.handleConnection(d)}
              />
            ))}
          </g>
          <g className="nodes">
            {graph.nodes.map(d => (
              <rect
                className={classnames({
                  highlight: d.name === id,
                  display: d.name === id1 || d.name === id2,
                })}
                key={d.name}
                x={d.x0}
                y={d.y0}
                width={d.x1 - d.x0}
                height={d.y1 - d.y0}
                onMouseEnter={() => this.handleNode(d)}
              />
            ))}
          </g>
        </svg>
        <Stats>
          <Stat>
            <div>Selected Node: <b>{id}</b></div>
          </Stat>
          <Stat>
            <div>Value: <b>{!!a ? a.toFixed(5) : ''}</b></div>
            <div>Error: <b>{!!error ? error.toFixed(5) : ''}</b></div>
          </Stat>
          <Stat>
            <div>FROM: <b>{id1}</b></div>
            <div>Weight: <b>{!!weight ? weight.toFixed(5) : ''}</b></div>
            <div>TO: <b>{id2}</b></div>
          </Stat>
        </Stats>
      </Graph>
    );
  }
}

export default Sankey;