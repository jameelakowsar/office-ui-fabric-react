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
            color: 'green',
            legend: 'MetaData1',
          },
          {
            name: '2020',
            data: 13,
            color: 'red',
            legend: 'metaData2',
          },
        ],
      },
      {
        xAxisPoint: 'Italy',
        series: [
          {
            name: '2010',
            data: 10,
            color: 'green',
            legend: 'MetaData1',
          },
          {
            name: '2020',
            data: 89,
            color: 'red',
            legend: 'metaData2',
          },
        ],
      },
    ];

    const rootStyle: IRootStyles = { width: '650px', height: '400px' };

    return (
      <div className={mergeStyles(rootStyle)}>
        <GroupedVerticalBarChart data={data} showYAxisGridLines />
      </div>
    );
  }
}
