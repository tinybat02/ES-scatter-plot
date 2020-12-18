import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Frame, CSVRow } from 'types';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import useCsvDownloader from 'use-csv-downloader';
import { processData } from './util/process';
import Icon from './img/save_icon.svg';
import './css/main.css';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  data: Array<{ id: string; data: Array<{ x: number; y: number }> }>;
  csvData: Array<CSVRow>;
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
    csvData: [],
  };
  componentDidMount() {
    if (this.props.data.series.length > 0 && this.props.options.flat_area) {
      const series = this.props.data.series as Array<Frame>;
      const { result, csvData } = processData(series, this.props.options.flat_area);
      this.setState({ data: result, csvData });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series !== this.props.data.series) {
      if (!this.props.options.flat_area) return;
      const series = this.props.data.series as Array<Frame>;
      if (series.length == 0) {
        this.setState({ data: [], csvData: [] });
        return;
      }
      const { result, csvData } = processData(series, this.props.options.flat_area);
      this.setState({ data: result, csvData });
    }
  }

  onDownload = () => {
    const { filename } = this.props.options;
    const downloadCsv = useCsvDownloader({ quote: '', delimiter: ',' });
    downloadCsv(this.state.csvData, `${filename}.csv`);
  };

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
        <img
          className="scatter-pane"
          src={Icon}
          onClick={this.onDownload}
          // style={{ position: 'absolute', top: 0, right: 2, zIndex: 2 }}
        />
        <ResponsiveScatterPlot
          data={data}
          colors={getRandomColor}
          margin={{ top: 80, right: 50, bottom: 70, left: 90 }}
          xScale={{ type: 'linear', min: 0, max: 'auto' }}
          xFormat={function(e) {
            return e + ' min';
          }}
          yScale={{ type: 'linear', min: 0, max: 'auto' }}
          yFormat={function(e) {
            return e + ' people/m2';
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
            legend: 'Number of Customers/m2',
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
              {`y: ${node.data.formattedY}`}
              <br />
              {`x: ${node.data.formattedX}`}
            </div>
          )}
        />
      </div>
    );
  }
}
