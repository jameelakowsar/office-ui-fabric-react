import * as React from 'react';
import { VerticalStackedBarChart } from '../VerticalStackedBarChart';
import { IVSChartDataPoint, IVerticalStackedChartProps } from '@uifabric/charting';
import { DefaultPalette, DefaultFontStyles } from 'office-ui-fabric-react/lib/Styling';

import { IVerticalStackedBarChartProps } from '@uifabric/charting/lib/VerticalStackedBarChart';

export class VerticalStackedBarChartBasicExample extends React.Component<IVerticalStackedBarChartProps, {}> {
  constructor(props: IVerticalStackedBarChartProps) {
    super(props);
  }

  public render(): JSX.Element {
    const firstChartPoints: IVSChartDataPoint[] = [
      { legend: 'Metadata1', data: 40, color: DefaultPalette.accent },
      { legend: 'Metadata2', data: 5, color: DefaultPalette.blueMid },
      { legend: 'Metadata3', data: 50, color: DefaultPalette.blueLight }
    ];

    const secondChartPoints: IVSChartDataPoint[] = [
      { legend: 'Metadata1', data: 30, color: DefaultPalette.accent },
      { legend: 'Metadata2', data: 30, color: DefaultPalette.blueMid },
      { legend: 'Metadata3', data: 40, color: DefaultPalette.blueLight }
    ];

    const thirdChartPoints: IVSChartDataPoint[] = [
      { legend: 'Metadata1', data: 10, color: DefaultPalette.accent },
      { legend: 'Metadata2', data: 60, color: DefaultPalette.blueMid },
      { legend: 'Metadata3', data: 30, color: DefaultPalette.blueLight }
    ];

    const data: IVerticalStackedChartProps[] = [
      { chartData: firstChartPoints, xAxisPoint: 'Jan' },
      { chartData: secondChartPoints, xAxisPoint: 'Feb' },
      { chartData: thirdChartPoints, xAxisPoint: 'March' },
      { chartData: firstChartPoints, xAxisPoint: 'April' },
      { chartData: thirdChartPoints, xAxisPoint: 'May' },
      { chartData: firstChartPoints, xAxisPoint: 'June' },
      { chartData: secondChartPoints, xAxisPoint: 'July' },
      { chartData: thirdChartPoints, xAxisPoint: 'August' },
      { chartData: firstChartPoints, xAxisPoint: 'September' }
    ];

    const textStyle = {
      fill: DefaultPalette.blueMid,
      fontSize: '14px'
    };

    const customStyles = () => {
      return {
        chart: {
          paddingBottom: '45px'
        },
        chartLabel: {
          color: DefaultPalette.blueMid,
          ...DefaultFontStyles.large
        },
        xAxisText: {
          transform: 'rotateZ(-40deg)',
          textAnchor: 'end',
          ...textStyle
        }
      };
    };

    return (
      <VerticalStackedBarChart data={data} yAxisTickCount={10} href={'www.google.com'} styles={customStyles} chartLabel="Card title" />
    );
  }
}
