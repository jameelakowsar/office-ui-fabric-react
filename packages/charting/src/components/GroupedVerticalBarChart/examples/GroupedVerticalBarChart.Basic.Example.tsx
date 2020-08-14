import * as React from 'react';
import { GroupedVerticalBarChart } from '@uifabric/charting';
import { DefaultPalette } from 'office-ui-fabric-react/lib/Styling';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

export class GroupedVerticalBarChartBasicExample extends React.Component<Readonly<{}>, {}> {
  public render(): React.ReactNode {
    const data = [
      {
        name: 'Total complete text here',
        series: [
          {
            key: 'series1',
            data: 90000,
            color: DefaultPalette.accent,
            legend: 'MetaData1',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '9%',
          },
          {
            key: 'series2',
            data: 85000,
            color: DefaultPalette.blueMid,
            legend: 'MetaData2',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '85%',
          },
          {
            key: 'series3',
            data: 36000,
            color: DefaultPalette.blueLight,
            legend: 'MetaData3',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '36%',
          },
        ],
      },
      {
        name: 'Second cahrt data',
        series: [
          {
            key: 'series1',
            data: 14000,
            color: DefaultPalette.accent,
            legend: 'MetaData1',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '14%',
          },
          {
            key: 'series2',
            data: 50000,
            color: DefaultPalette.blueMid,
            legend: 'MetaData2',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '50%',
          },
          {
            key: 'series3',
            data: 33000,
            color: DefaultPalette.blueLight,
            legend: 'MetaData3',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '33%',
          },
        ],
      },
      {
        name: 'Kowsar shaik',
        series: [
          {
            key: 'series1',
            data: 33000,
            color: DefaultPalette.accent,
            legend: 'MetaData1',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '33%',
          },
          {
            key: 'series2',
            data: 3000,
            color: DefaultPalette.blueMid,
            legend: 'MetaData2',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '3%',
          },
          {
            key: 'series3',
            data: 75000,
            color: DefaultPalette.blueLight,
            legend: 'MetaData3',
            xAxisCalloutData: '2020/04/30',
            yAxisCalloutData: '75%',
          },
        ],
      },
    ];

    const rootStyle = mergeStyles({ width: '650px', height: '400px' });

    return (
      <div className={rootStyle}>
        <GroupedVerticalBarChart data={data} height={400} width={650} showYAxisGridLines />
        {/* <GroupedVerticalBarChart data={data} height={400} width={650} showYAxisGridLines /> */}
      </div>
    );
  }
}
