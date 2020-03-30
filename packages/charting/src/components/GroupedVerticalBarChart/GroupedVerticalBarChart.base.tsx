import * as React from 'react';
import { max as d3Max } from 'd3-array';
import { axisLeft as d3AxisLeft, axisBottom as d3AxisBottom, Axis as D3Axis } from 'd3-axis';
import { scaleBand as d3ScaleBand, scaleLinear as d3ScaleLinear, ScaleLinear as D3ScaleLinear } from 'd3-scale';
import { select as d3Select } from 'd3-selection';
import { classNamesFunction, asAsync } from 'office-ui-fabric-react/lib/Utilities';
import { IProcessedStyleSet, IPalette } from 'office-ui-fabric-react/lib/Styling';
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { ILegend, Legends } from '../Legends/index';

import {
  IGroupedVerticalBarChartProps,
  IGroupedVerticalBarChartStyleProps,
  IGroupedVerticalBarChartStyles,
} from './GroupedVerticalBarChart.types';
import { IGroupedVerticalBarChartDataPoint, IGVSBarChartSeriesPoint } from '../../types';

const getClassNames = classNamesFunction<IGroupedVerticalBarChartStyleProps, IGroupedVerticalBarChartStyles>();
type stringAxis = D3Axis<string>;
type numericAxis = D3Axis<number | { valueOf(): number }>;

export interface IRefArrayData {
  legendText?: string;
  refElement?: SVGGElement;
}

export interface IGroupedVerticalBarChartState {
  isCalloutVisible: boolean;
  isLegendSelected: boolean;
  isLegendHovered: boolean;
  selectedLegendTitle: string;
  // tslint:disable-next-line:no-any
  refSelected: any;
  dataForHoverCard: number;
  color: string;
  containerWidth: number;
  containerHeight: number;
  _width: number;
  _height: number;
}

export class GroupedVerticalBarChartBase extends React.Component<
  IGroupedVerticalBarChartProps,
  IGroupedVerticalBarChartState
> {
  private _points: IGroupedVerticalBarChartDataPoint[];
  private _barWidth: number;
  private _yAxisTickCount: number;
  private _barPadding: number;
  private _groupPadding: number;
  private _colors: string[];
  private _showXAxisGridLines: boolean;
  private _showYAxisGridLines: boolean;
  private _showXAxisPath: boolean;
  private _classNames: IProcessedStyleSet<IGroupedVerticalBarChartStyles>;
  private _refArray: IRefArrayData[];
  private _reqID: number;
  private _yMax: number;
  private _xAxisLabels: number[] | string[] | Date[];
  private _yAxisScale: any;
  private _xAxisScale: any;
  private _xAxisTickCount: number;
  private legendContainer: HTMLDivElement;
  private chartContainer: HTMLDivElement;
  private minLegendContainerHeight: number = 32;
  private margins = { top: 20, right: 20, bottom: 35, left: 40 };

  public constructor(props: IGroupedVerticalBarChartProps) {
    super(props);
    this.state = {
      isCalloutVisible: false,
      isLegendSelected: false,
      isLegendHovered: false,
      selectedLegendTitle: '',
      refSelected: null,
      dataForHoverCard: 0,
      color: '',
      containerWidth: 0,
      containerHeight: 0,
      _width: this.props.width || 600,
      _height: this.props.height || 350,
    };
    this._adjustProps();
  }

  public componentDidMount(): void {
    this._fitParentContainer();
    window.addEventListener('resize', this._fitParentContainer);
  }

  public componentWillUnmount(): void {
    cancelAnimationFrame(this._reqID);
  }

  public render(): React.ReactNode {
    const { theme, className, styles } = this.props;

    if (this.props.parentRef) {
      this._fitParentContainer();
    }

    let isDataPresent: boolean = false;
    let dataType: string = ''; // may use for future requirements of differ x- axis

    if (this._points && this._points.length > 0) {
      isDataPresent = true;
      dataType = 'string';
    }

    this._xAxisLabels = this.getXAxisLabels();
    const dataset = this._getDataSet();

    let xAxis: stringAxis;
    let yAxis: numericAxis;
    let bars: any;
    if (isDataPresent) {
      xAxis = this._createStringXAxis(this._xAxisLabels);
      yAxis = this._createYAxis(dataset);
      bars = this._getBars();
    }

    this._classNames = getClassNames(styles!, {
      theme: theme!,
      width: this.state._width,
      height: this.state._height,
      className,
      legendColor: this.state.color,
      showXAxisPath: this._showXAxisPath,
    });

    const svgDimensions = {
      width: this.state.containerWidth,
      height: this.state.containerHeight,
    };
    return (
      <div ref={(rootElem: HTMLDivElement) => (this.chartContainer = rootElem)} className={this._classNames.root}>
        <svg width={svgDimensions.width} height={svgDimensions.height}>
          <g
            ref={(node: SVGGElement | null) => this._setXAxis(node, xAxis)}
            className={this._classNames.xAxis}
            transform={`translate(0, ${svgDimensions.height - 35})`}
          />
          <g
            ref={(node: SVGGElement | null) => this._setYAxis(node, yAxis)}
            className={this._classNames.yAxis}
            transform={`translate(40, 0)`}
          />
          <g>{bars}</g>
        </svg>
      </div>
    );
  }

  private _adjustProps(): void {
    this._points = this.props.data || [];
    this._barWidth = this.props.barWidth || 16;
    this._yAxisTickCount = this.props.yAxisTickCount || 5;
    this._barPadding = this.props.barPadding || 4;
    this._groupPadding = this.props.groupPadding || 16;
    this._xAxisLabels = this.props.xAxisLabels || [];
    this._showXAxisGridLines = this.props.showXAxisGridLines || false;
    this._showYAxisGridLines = this.props.showYAxisGridLines || false;
    this._showXAxisPath = this.props.showXAxisPath || false;

    const { theme } = this.props;
    const { palette } = theme!;
    this._colors = this.props.colors || [palette.blueLight, palette.blue, palette.blueMid, palette.red, palette.black];
  }

  private _fitParentContainer(): void {
    const { containerWidth, containerHeight } = this.state;
    // take care after legends added
    this._reqID = requestAnimationFrame(() => {
      // const legendContainerComputedStyles = getComputedStyle(this.legendContainer);
      // const legendContainerHeight =
      //   (this.legendContainer.getBoundingClientRect().height || this.minLegendContainerHeight) +
      //   parseFloat(legendContainerComputedStyles.marginTop || '0') +
      //   parseFloat(legendContainerComputedStyles.marginBottom || '0');
      const legendContainerHeight = 32;
      const container = this.props.parentRef ? this.props.parentRef : this.chartContainer;
      const currentContainerWidth = container.getBoundingClientRect().width;
      const currentContainerHeight =
        container.getBoundingClientRect().height > legendContainerHeight
          ? container.getBoundingClientRect().height
          : 350;
      const shouldResize =
        containerWidth !== currentContainerWidth || containerHeight !== currentContainerHeight - legendContainerHeight;
      if (shouldResize) {
        this.setState({
          containerWidth: currentContainerWidth,
          containerHeight: currentContainerHeight - legendContainerHeight,
        });
      }
    });
  }

  private getXAxisLabels = () => {
    // to get what lables show we show at x-axis labels | may be from props also otherwise we need to form
    if (this._xAxisLabels && this._xAxisLabels.length > 0) {
      return this._xAxisLabels;
    } else {
      const xAxisLabels: any[] = [];
      let xAxisTickCount: number = 0;
      this._points &&
        this._points.map((singlePoint: IGroupedVerticalBarChartDataPoint) => {
          xAxisTickCount++;
          xAxisLabels.push(singlePoint.xAxisPoint);
        });
      this._xAxisTickCount = xAxisTickCount;
      return xAxisLabels;
    }
  };

  private _getDataSet = (): [] => {
    // forming like- name:dataValue to get max value for y axis
    const dataSet: any = [];
    this._points.map((singleDataPoint: IGroupedVerticalBarChartDataPoint) => {
      const singleDataSetPoint: any = {};
      singleDataPoint.series.map((singleSeriesPoint: IGVSBarChartSeriesPoint) => {
        singleDataSetPoint[singleSeriesPoint.name] = singleSeriesPoint.data;
      });
      dataSet.push(singleDataSetPoint);
    });
    return dataSet;
  };

  private _createStringXAxis(xAxisLabels: string[] | number[] | Date[]): stringAxis {
    // const xMax =
    //   this.state.containerWidth -
    //   this.margins.left -
    //   this.margins.right -
    //   this._groupPadding * (xAxisLabels.length - 1);
    // const interval = Math.ceil(xMax / this._xAxisTickCount);
    // console.log('dataaaaa', interval, xMax);

    // const domains: Array<number> = [0];
    // let count = 0;
    // while (domains[domains.length - 1] < xMax) {
    //   if (count) {
    //     domains.push(domains[domains.length - 1] + this._groupPadding);
    //     count = 0;
    //   } else {
    //     domains.push(domains[domains.length - 1] + interval);
    //     count = 1;
    //   }
    // }
    // console.log(domains, 'domains');
    const xAxisScale = d3ScaleBand()
      .domain(xAxisLabels.map((label: string) => label))
      .range([this.margins.left, this.state.containerWidth - this.margins.right]);
    // .padding(1);
    const xAxis = d3AxisBottom(xAxisScale)
      .tickFormat((x: string, index: number) => xAxisLabels[index] as string)
      .tickPadding(10);

    this._xAxisScale = xAxisScale;

    this._showXAxisGridLines && // we can show x-axis grid lines also based on prop values
      xAxis.tickSizeInner(-(this.state.containerHeight - this.margins.bottom - this.margins.top));
    return xAxis;
  }

  private _createYAxis(dataset: any[]): numericAxis {
    const keys: string[] = Object.keys(dataset[0]).map((key: string) => key); // logic optimizations needed
    const yMax: number = d3Max(dataset, (point: any) => d3Max(keys, (key: string) => point[key]));
    this._yMax = yMax;
    const interval = Math.ceil(yMax / this._yAxisTickCount);
    const domains: Array<number> = [0];
    while (domains[domains.length - 1] < yMax) {
      domains.push(domains[domains.length - 1] + interval);
    }
    const yAxisScale = d3ScaleLinear()
      .domain([0, domains[domains.length - 1]])
      .range([this.state.containerHeight - this.margins.bottom, this.margins.top]);
    const yAxis = d3AxisLeft(yAxisScale)
      .tickPadding(10)
      .tickValues(domains);

    this._yAxisScale = yAxisScale;

    this._showYAxisGridLines &&
      yAxis.tickSizeInner(-(this.state.containerWidth - this.margins.left - this.margins.right));

    return yAxis;
  }

  private _createBar = (singleDataPoint: IGroupedVerticalBarChartDataPoint, indexNumber: number) => {
    const yMax = this._yMax;

    const endpointDistance = 0.5 * ((this.state.containerWidth - this.margins.right) / this._xAxisTickCount);

    const xBarScale = d3ScaleLinear()
      .domain([0, this._xAxisTickCount])
      .range([endpointDistance - 0.5 * this._barWidth, this.state._width - endpointDistance - 0.5 * this._barWidth]);
    const yBarScale = d3ScaleLinear()
      .domain([0, yMax])
      .range([0, this.state.containerHeight - this.margins.bottom - this.margins.top]);
    const bar = singleDataPoint.series.map((seriesPoint: any, index: number) => {
      return (
        <rect
          key={index + indexNumber}
          x={xBarScale(index + indexNumber)} // Here need to check How to get x value. because of index + indexNumber I am getting repeated x value
          y={this.state.containerHeight - this.margins.bottom - yBarScale(seriesPoint.data)}
          width={this._barWidth}
          height={yBarScale(seriesPoint.data)}
          fill={seriesPoint.color}
        />
      );
    });
    return bar;
  };

  private _getBars = () => {
    const groupBars: JSX.Element[] = [];
    const yMax = this._yMax;

    this._points.map((singleDataPoint: IGroupedVerticalBarChartDataPoint, index: number) => {
      const singleGroupSlot = this._createBar(singleDataPoint, index);
      groupBars.push(singleGroupSlot);
    });
    return groupBars;
  };

  private _setXAxis(node: SVGGElement | null, xAxis: numericAxis | stringAxis): void {
    if (node === null) {
      return;
    }
    const axisNode = d3Select(node).call(xAxis);
    // axisNode.selectAll('text').attr('class', this._classNames.xAxisText!);
  }

  private _setYAxis(node: SVGElement | null, yAxis: numericAxis): void {
    if (node === null) {
      return;
    }
    d3Select(node).call(yAxis);
  }
}
