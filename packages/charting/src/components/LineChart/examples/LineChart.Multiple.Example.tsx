import * as React from 'react';
import { IChartProps, ILineChartPoints, ILineChartProps, LineChart } from '@uifabric/charting';
import { DefaultPalette } from 'office-ui-fabric-react/lib/Styling';

interface ILineChartMultipleExampleState {
  width: number;
  height: number;
}

export class LineChartMultipleExample extends React.Component<{}, ILineChartMultipleExampleState> {
  constructor(props: ILineChartProps) {
    super(props);
    this.state = {
      width: 700,
      height: 300,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <label>change Width:</label>
        <input type="range" value={this.state.width} min={200} max={1000} onChange={this._onWidthChange} />
        <label>change Height:</label>
        <input type="range" value={this.state.height} min={200} max={1000} onChange={this._onHeightChange} />
        <div>{this._styledExample()}</div>
      </>
    );
  }

  private _onLegendClickHandler = (selectedLegend: string | null): void => {
    if (selectedLegend !== null) {
      console.log(`Selected legend - ${selectedLegend}`);
    }
  };

  private _styledExample(): JSX.Element {
    const points = [
      {
        data: [
          { x: new Date('2020/07/14'), y: 2838 },
          { x: new Date('2020/07/15'), y: 500 },
          { x: new Date('2020-07-16'), y: 1836 },
          // { x: new Date('2020-07-17'), y: 2836 },
          // { x: new Date('2020-07-18'), y: 2839 },
        ],
        legend: 'Second',
        color: DefaultPalette.green,
        onLegendClick: this._onLegendClickHandler,
      },
      {
        data: [
          { x: new Date('2020/07/14'), y: 1101 },
          { x: new Date('2020/07/15'), y: 2013 },
          { x: new Date('2020-07-16'), y: 10 },
          // { x: new Date('2020-07-17'), y: 5 },
          // { x: new Date('2020-07-18'), y: 3 },
        ],
        legend: 'Third',
        color: DefaultPalette.red,
        onLegendClick: this._onLegendClickHandler,
      },
    ];

    const data: IChartProps = {
      chartTitle: 'Line Chart',
      lineChartData: points,
    };
    const rootStyle = { width: `${this.state.width}px`, height: `${this.state.height}px` };
    const timeFormat = '%m/%d';
    // Passing tick values is optional, for more control.
    // If you do not pass them the line chart will render them for you based on D3's standard.
    const tickValues: Date[] = [
      new Date('01-01-2018'),
      new Date('02-01-2018'),
      new Date('03-01-2018'),
      new Date('04-01-2018'),
      new Date('05-01-2018'),
      new Date('06-01-2018'),
    ];
    return (
      <div style={rootStyle}>
        <LineChart
          data={data}
          strokeWidth={4}
          tickFormat={timeFormat}
          tickValues={tickValues}
          enabledLegendsWrapLines={true}
          height={this.state.height}
          width={this.state.width}
        />
      </div>
    );
  }

  private _onWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ width: parseInt(e.target.value, 10) });
  };
  private _onHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ height: parseInt(e.target.value, 10) });
  };
}
