import * as React from 'react';
import { GroupedVerticalBarChart } from '../GroupedVerticalBarChart'; // change this import path
import { DefaultPalette } from 'office-ui-fabric-react/lib/Styling';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

interface IRootStyles {
  height: string;
  width: string;
}

export class GroupedVerticalBarChartBasicExample extends React.Component<Readonly<{}>, {}> {
  public render(): React.ReactNode {
    const data = [
      {
        xAxisPoint: 'India',
        series: [
          {
            name: '2010',
            data: 54,
            color: DefaultPalette.accent,
            legend: 'MetaData1',
          },
          {
            name: '2020',
            data: 13,
            color: DefaultPalette.blueMid,
            legend: 'MetaData2',
          },
          {
            name: '2011',
            data: 34,
            color: DefaultPalette.blueLight,
            legend: 'MetaData3',
          },
          {
            name: '2050',
            data: 27,
            color: 'yellow',
            legend: 'MetaData4',
          },
          {
            name: '2101',
            data: 34,
            color: 'red',
            legend: 'MetaData5',
          },
        ],
      },
      {
        xAxisPoint: 'Italy',
        series: [
          {
            name: '2010',
            data: 10,
            color: DefaultPalette.accent,
            legend: 'MetaData1',
          },
          {
            name: '2020',
            data: 89,
            color: DefaultPalette.blueMid,
            legend: 'MetaData2',
          },
          {
            name: '2011',
            data: 72,
            color: DefaultPalette.blueLight,
            legend: 'MetaData3',
          },
          {
            name: '2050',
            data: 66,
            color: 'yellow',
            legend: 'MetaData4',
          },
          {
            name: '2101',
            data: 34,
            color: 'red',
            legend: 'MetaData5',
          },
        ],
      },
      {
        xAxisPoint: 'Aus',
        series: [
          {
            name: '2010',
            data: 40,
            color: DefaultPalette.accent,
            legend: 'MetaData1',
          },
          {
            name: '2020',
            data: 77,
            color: DefaultPalette.blueMid,
            legend: 'MetaData2',
          },
          {
            name: '2011',
            data: 2,
            color: DefaultPalette.blueLight,
            legend: 'MetaData3',
          },
          {
            name: '2050',
            data: 66,
            color: 'yellow',
            legend: 'MetaData4',
          },
          {
            name: '2101',
            data: 34,
            color: 'red',
            legend: 'MetaData5',
          },
        ],
      },
      {
        xAxisPoint: 'England',
        series: [
          {
            name: '2010',
            data: 20,
            color: DefaultPalette.accent,
            legend: 'MetaData1',
          },
          {
            name: '2020',
            data: 37,
            color: DefaultPalette.blueMid,
            legend: 'MetaData2',
          },
          {
            name: '2011',
            data: 2,
            color: DefaultPalette.blueLight,
            legend: 'MetaData3',
          },
          {
            name: '2050',
            data: 66,
            color: 'yellow',
            legend: 'MetaData4',
          },
          {
            name: '2101',
            data: 34,
            color: 'red',
            legend: 'MetaData5',
          },
        ],
      },
      // {
      //   xAxisPoint: 'Erope',
      //   series: [
      //     {
      //       name: '2010',
      //       data: 40,
      //       color: 'green',
      //       legend: 'MetaData1',
      //     },
      //     {
      //       name: '2020',
      //       data: 77,
      //       color: 'red',
      //       legend: 'metaData2',
      //     },
      //     {
      //       name: '2011',
      //       data: 2,
      //       color: 'orange',
      //       legend: 'MetaData1',
      //     },
      //     {
      //       name: '2050',
      //       data: 66,
      //       color: 'yellow',
      //       legend: 'metaData2',
      //     },
      //     {
      //       name: '2101',
      //       data: 34,
      //       color: 'balck',
      //       legend: 'MetaData1',
      //     },
      //   ],
      // },
      // // {
      //   xAxisPoint: 'Paris',
      //   series: [
      //     {
      //       name: '2010',
      //       data: 54,
      //       color: 'green',
      //       legend: 'MetaData1',
      //     },
      //     {
      //       name: '2020',
      //       data: 13,
      //       color: 'red',
      //       legend: 'metaData2',
      //     },
      //   ],
      // },
    ];

    const rootStyle: IRootStyles = { width: '650px', height: '400px' };

    return (
      <div className={mergeStyles(rootStyle)}>
        <GroupedVerticalBarChart data={data} showYAxisGridLines />
      </div>
    );
  }
}
