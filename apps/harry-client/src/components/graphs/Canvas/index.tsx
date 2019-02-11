import React from 'react';

import { Graph } from './styles.emo';

type Props = {
  height: number,
  width: number,
  resolution: number,
  data?: number[],
};

const getGray = (y: number): number[] => [y, y, y];

class Canvas extends React.Component<Props, {}> {

  static defaultProps = {
    height: 200,
    width: 200,
    resolution: 100,
    data: [],
  }

  componentDidMount() {
    this.updateCanvas();
  }

  componentWillReceiveProps() {
    this.updateCanvas();
  }

  updateCanvas = () => {
    const { data, resolution } = this.props;

    const canvas = this.refs.canvas as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const c = ctx.getImageData(0, 0, resolution, resolution);

    for (var i = 0; i < data.length; i++) {
      const j = i * 4;
      c.data[j] = c.data[j + 1] = c.data[j + 2] = data[i] * 255;
    }
    ctx.putImageData(c, 0, 0);
  }

  render() {
    const { width, height } = this.props;

    return (
      <Graph className="grid">
        <canvas ref={'canvas'} width={width} height={height} />
      </Graph>
    )
  }
}

export default Canvas;