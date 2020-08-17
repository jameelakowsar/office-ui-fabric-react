import * as React from 'react';
import { IChartProps, ILineChartProps, LineChart } from '@uifabric/charting';
import { DefaultPalette } from 'office-ui-fabric-react/lib/Styling';

interface ILineChartBasicState {
  width: number;
  height: number;
}

export class LineChartBasicExample extends React.Component<{}, ILineChartBasicState> {
  constructor(props: ILineChartProps) {
    super(props);
    this.state = {
      width: 700,
      height: 300,
    };
  }

  public render(): JSX.Element {
    return <div>{this._basicExample()}</div>;
  }

  private _onWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ width: parseInt(e.target.value, 10) });
  };
  private _onHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ height: parseInt(e.target.value, 10) });
  };

  private _basicExample(): JSX.Element {
    const data: IChartProps = {
      chartTitle: 'Line Chart',
      lineChartData: [
        {
          legend: 'From_Legacy_to_O365',
          data: [
            {
              x: new Date('2020-03-03T00:00:00.000Z'),
              y: 216000,
              onDataPointClick: () => alert('click on 217000'),
            },
            {
              x: new Date('2020-03-03T10:00:00.000Z'),
              y: 218123,
              onDataPointClick: () => alert('click on 217123'),
            },
            {
              x: new Date('2020-03-03T11:00:00.000Z'),
              y: 217124,
              onDataPointClick: () => alert('click on 217124'),
            },
            {
              x: new Date('2020-03-04T00:00:00.000Z'),
              y: 248000,
              onDataPointClick: () => alert('click on 248000'),
            },
            {
              x: new Date('2020-03-05T00:00:00.000Z'),
              y: 252000,
              onDataPointClick: () => alert('click on 252000'),
            },
            {
              x: new Date('2020-03-06T00:00:00.000Z'),
              y: 274000,
              onDataPointClick: () => alert('click on 274000'),
            },
            {
              x: new Date('2020-03-07T00:00:00.000Z'),
              y: 260000,
              onDataPointClick: () => alert('click on 260000'),
            },
            {
              x: new Date('2020-03-08T00:00:00.000Z'),
              y: 300000,
              onDataPointClick: () => alert('click on 300000'),
            },
            {
              x: new Date('2020-03-09T00:00:00.000Z'),
              y: 218000,
              onDataPointClick: () => alert('click on 218000'),
            },
          ],
          color: DefaultPalette.blue,
          onLineClick: () => console.log('From_Legacy_to_O365'),
        },
        {
          legend: 'All',
          data: [
            {
              x: new Date('2020-03-03T00:00:00.000Z'),
              y: 297000,
            },
            {
              x: new Date('2020-03-04T00:00:00.000Z'),
              y: 284000,
            },
            {
              x: new Date('2020-03-05T00:00:00.000Z'),
              y: 282000,
            },
            {
              x: new Date('2020-03-06T00:00:00.000Z'),
              y: 294000,
            },
            {
              x: new Date('2020-03-07T00:00:00.000Z'),
              y: 224000,
            },
            {
              x: new Date('2020-03-08T00:00:00.000Z'),
              y: 300000,
            },
            {
              x: new Date('2020-03-09T00:00:00.000Z'),
              y: 298000,
            },
          ],
          color: DefaultPalette.green,
        },
      ],
    };

    const rootStyle = { width: `${this.state.width}px`, height: `${this.state.height}px` };
    const margins = { left: 35, top: 20, bottom: 35, right: 20 };

    return (
      <>
        <label>change Width:</label>
        <input type="range" value={this.state.width} min={200} max={1000} onChange={this._onWidthChange} />
        <label>change Height:</label>
        <input type="range" value={this.state.height} min={200} max={1000} onChange={this._onHeightChange} />
        <div style={rootStyle}>
          <LineChart
            data={data}
            legendsOverflowText={'Overflow Items'}
            yMinValue={200}
            yMaxValue={301}
            height={this.state.height}
            width={this.state.width}
            margins={margins}
          />
        </div>
      </>
    );
  }
}

// const points: ILineChartPoints[] = [
//   {
//     data: [
//       { x: new Date('2018/01/01'), y: 10, xAxisCalloutData: '2018/01/01', yAxisCalloutData: '10%' },
//       { x: new Date('2018/01/15'), y: 18, xAxisCalloutData: '2018/01/15', yAxisCalloutData: '18%' },
//       { x: new Date('2018/01/28'), y: 24, xAxisCalloutData: '2018/01/28', yAxisCalloutData: '24%' },
//       { x: new Date('2018/02/01'), y: 25, xAxisCalloutData: '2018/02/01', yAxisCalloutData: '25%' },
//       { x: new Date('2018/03/01'), y: 15, xAxisCalloutData: '2018/03/01', yAxisCalloutData: '15%' },
//       { x: new Date('2018/03/15'), y: 30, xAxisCalloutData: '2018/03/15', yAxisCalloutData: '30%' },
//       { x: new Date('2018/03/28'), y: 18, xAxisCalloutData: '2018/03/28', yAxisCalloutData: '18%' },
//       { x: new Date('2018/04/04'), y: 32, xAxisCalloutData: '2018/04/04', yAxisCalloutData: '32%' },
//       { x: new Date('2018/04/15'), y: 29, xAxisCalloutData: '2018/04/15', yAxisCalloutData: '29%' },
//       { x: new Date('2018/05/05'), y: 43, xAxisCalloutData: '2018/05/05', yAxisCalloutData: '43%' },
//       { x: new Date('2018/06/01'), y: 45, xAxisCalloutData: '2018/06/01', yAxisCalloutData: '45%' },
//     ],
//     legend: 'First',
//     color: DefaultPalette.blue,
//     onLegendClick: this._onLegendClickHandler,
//   },
//   {
//     data: [
//       { x: new Date('2018/01/01'), y: 10 },
//       { x: new Date('2018/01/07'), y: 18 },
//       { x: new Date('2018/01/15'), y: 24 },
//       { x: new Date('2018/02/01'), y: 25 },
//       { x: new Date('2018/03/10'), y: 15 },
//       { x: new Date('2018/03/15'), y: 30 },
//       { x: new Date('2018/03/20'), y: 18 },
//       { x: new Date('2018/04/10'), y: 32 },
//       { x: new Date('2018/04/20'), y: 29 },
//       { x: new Date('2018/05/16'), y: 43 },
//       { x: new Date('2018/06/01'), y: 45 },
//     ],
//     legend: 'Second',
//     color: DefaultPalette.green,
//     onLegendClick: this._onLegendClickHandler,
//   },
//   {
//     data: [
//       { x: new Date('2018/01/06'), y: 10 },
//       { x: new Date('2018/01/18'), y: 18 },
//       { x: new Date('2018/01/25'), y: 24 },
//       { x: new Date('2018/02/10'), y: 25 },
//       { x: new Date('2018/03/03'), y: 15 },
//       { x: new Date('2018/03/07'), y: 30 },
//       { x: new Date('2018/03/15'), y: 18 },
//       { x: new Date('2018/04/10'), y: 32 },
//       { x: new Date('2018/04/17'), y: 29 },
//       { x: new Date('2018/05/10'), y: 43 },
//       { x: new Date('2018/06/01'), y: 45 },
//     ],
//     legend: 'Third',
//     color: DefaultPalette.red,
//     onLegendClick: this._onLegendClickHandler,
//   },
// ];
