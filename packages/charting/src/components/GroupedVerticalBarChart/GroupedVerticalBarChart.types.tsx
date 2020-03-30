import { ITheme, IStyle } from 'office-ui-fabric-react/lib/Styling';
import { IGroupedVerticalBarChartDataPoint } from '@uifabric/charting';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';

export interface IGroupedVerticalBarChartProps {
  /**
   * Data to render in the chart.
   */
  data: IGroupedVerticalBarChartDataPoint[];

  /**
   * Width of the chart.
   */
  width?: number;

  /**
   * Height of the chart.
   */
  height?: number;

  /**
   * Width of each bar in the chart.
   */
  barWidth?: number;

  /**
   * Number of ticks on the y-axis.
   */
  yAxisTickCount?: number;

  /**
   * Colors from which to select the color of each bar.
   */
  colors?: string[];

  /**
   * Label to apply to the whole chart.
   */
  chartLabel?: string;

  /**
   * Additional CSS class(es) to apply to the VerticalStackedBarChart.
   */
  className?: string;

  /**
   * Theme (provided through customization.)
   */
  theme?: ITheme;

  /**
   * Call to provide customized styling that will layer on top of the variant rules.
   */
  styles?: IStyleFunctionOrObject<IGroupedVerticalBarChartStyleProps, IGroupedVerticalBarChartStyles>;

  /**
   * this prop takes its parent as a HTML element to define the width and height of the line chart
   */
  parentRef?: HTMLElement | null;

  /**
   * Prop to show x-axis gridlines or not
   */
  showXAxisGridLines?: boolean;

  /**
   * Prop to show y-axis gridlines or not
   */
  showYAxisGridLines?: boolean;

  /**
   * to display x-axis lables word wrap or not (long text break into space separated words)
   */
  showWordWrap?: boolean;

  /**
   * Padding between bars in px
   */
  barPadding?: number;

  /**
   * Padding between groups in px
   */
  groupPadding?: number;

  /**
   * The x-axis label text
   */
  xAxisLabel?: string;

  /**
   * The Y-axis Label text
   */
  yAxisLabel?: string;

  /**
   * this prop takes values that you want the Grouped Vertical bar chart to render on x-axis
   * This is a optional parameter if not specified D3 will decide which values appear on the x-axis for you
   * Please look at https://github.com/d3/d3-scale for more information on how D3 decides what data to appear on the axis of chart
   */
  xAxisLabels?: number[] | string[] | Date[];

  /**
   * Predefined list of y-axis tick values
   */
  yAxisTicks?: any[];

  /**
   * To display x-axis path or transparent
   */
  showXAxisPath?: boolean;

  /**
   * To display y-axis path or transparent
   */
  showYAxisPath?: boolean;

  /**
   * Url that the data-viz needs to redirect to upon clicking on it
   */
  href?: string;
}

export interface IGroupedVerticalBarChartStyleProps {
  /**
   * Theme (provided through customization.)
   */
  theme: ITheme;

  /**
   * Additional CSS class(es) to apply to the StackedBarChart.
   */
  className?: string;

  /**
   * Width of the chart.
   */
  width: number;

  /**
   * Height of the chart.
   */
  height: number;

  /**
   * color of the datapoint legend
   */
  legendColor?: string;

  /**
   * Link to redirect if click action for graph
   */
  href?: string;

  /**
   * prop to check if the chart is selcted or hovered upon to determine opacity
   */
  shouldHighlight?: boolean;

  showXAxisPath?: boolean;
}

export interface IGroupedVerticalBarChartStyles {
  /**
   *  Style for the root element.
   */
  root?: IStyle;

  /**
   * Style for the chart.
   */
  chart?: IStyle;

  /**
   * Style for the chart label.
   */
  chartLabel?: IStyle;

  /**
   * Style for the element containing the x-axis.
   */
  xAxis?: IStyle;

  /**
   * Style for the element containing the y-axis.
   */
  yAxis?: IStyle;
}
