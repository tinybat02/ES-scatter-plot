import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Frame } from 'types';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { processData } from './util/process';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  data: Array<{ id: string; data: Array<{ x: number; y: number }> }>;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export class MainPanel extends PureComponent<Props, State> {
  state: State = {
    data: [],
  };
  componentDidMount() {
    if (this.props.data.series.length > 0) {
      const series = this.props.data.series as Array<Frame>;
      const result = processData(series);
      this.setState({ data: result });
    }
  }

  componentDidUpdate(prevProps: Props) {}

  render() {
    const { width, height } = this.props;
    const { data } = this.state;
    return (
      <div
        style={{
          width,
          height,
        }}
      >
        <ResponsiveScatterPlot
          data={data}
          colors={getRandomColor}
          margin={{ top: 50, right: 50, bottom: 70, left: 90 }}
          xScale={{ type: 'linear', min: 0, max: 'auto' }}
          xFormat={function(e) {
            return e + ' min';
          }}
          yScale={{ type: 'linear', min: 0, max: 'auto' }}
          yFormat={function(e) {
            return e + ' people';
          }}
          blendMode="multiply"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Duration Spent',
            legendPosition: 'middle',
            legendOffset: 46,
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Number of Customers',
            legendPosition: 'middle',
            legendOffset: -60,
          }}
          tooltip={({ node }) => (
            <div
              style={{
                color: node.style.color,
                background: '#fff',
                padding: '12px 16px',
                borderRadius: 5,
                border: `2px solid ${node.style.color}`,
                zIndex: 10,
              }}
            >
              <strong>{node.id.split('.')[0]}</strong>
              <br />
              {`x: ${node.data.formattedX}`}
              <br />
              {`y: ${node.data.formattedY}`}
            </div>
          )}
        />
      </div>
    );
  }
}
