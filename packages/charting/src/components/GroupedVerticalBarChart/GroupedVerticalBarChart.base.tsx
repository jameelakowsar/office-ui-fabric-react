import * as React from 'react';
import { max as d3Max } from 'd3-array';
import { axisLeft as d3AxisLeft, axisBottom as d3AxisBottom, Axis as D3Axis } from 'd3-axis';
import { scaleBand as d3ScaleBand, scaleLinear as d3ScaleLinear, ScaleLinear as D3ScaleLinear } from 'd3-scale';
import { select as d3Select } from 'd3-selection';
import { classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { IProcessedStyleSet, IPalette } from 'office-ui-fabric-react/lib/Styling';
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { ILegend, Legends } from '../Legends/index';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';

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
  private _xAxisTickCount: number;
  private _barPadding: number;
  private _groupPadding: number;
  private _colors: string[];
  private _showXAxisGridLines: boolean;
  private _showYAxisGridLines: boolean;
  private _showXAxisPath: boolean;
  private _showYAxisPath: boolean;
  private _classNames: IProcessedStyleSet<IGroupedVerticalBarChartStyles>;
  private _refArray: IRefArrayData[];
  private _reqID: number;
  private _yMax: number;
  private _xAxisLabels: string[];
  private _yAxisScale: any;
  private _xAxisScale: any;
  private _x1Scale: any;
  private _keys: string[];
  private legendContainer: HTMLDivElement;
  private chartContainer: HTMLDivElement;
  private minLegendContainerHeight: number = 32;
  private margins = { top: 20, right: 20, bottom: 35, left: 40 };

  public constructor(props: IGroupedVerticalBarChartProps) {
    super(props);
    this.state = {
      containerWidth: 0,
      containerHeight: 0,
      color: '',
      dataForHoverCard: 0,
      isCalloutVisible: false,
      isLegendSelected: false,
      isLegendHovered: false,
      refSelected: null,
      selectedLegendTitle: '',
      _width: this.props.width || 600,
      _height: this.props.height || 350,
    };
    this._refArray = [];
    this._onLegendLeave = this._onLegendLeave.bind(this);
    this._onBarLeave = this._onBarLeave.bind(this);
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
    // need to handle if no data case
    this._xAxisLabels = this.getXAxisLabels();
    const dataset = this._getDataSet();
    const xAxis: stringAxis = this._createStringXAxis(this._xAxisLabels);
    const yAxis: numericAxis = this._createYAxis(dataset);
    const bars: JSX.Element[] = this._getBars();
    const legends: JSX.Element = this._getLegendData(this.props.theme!.palette);

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
        <FocusZone direction={FocusZoneDirection.horizontal}>
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
        </FocusZone>
        <div ref={(e: HTMLDivElement) => (this.legendContainer = e)} className={this._classNames.legendContainer}>
          {legends}
        </div>
        {this.state.isCalloutVisible ? (
          <Callout
            target={this.state.refSelected}
            gapSpace={10}
            isBeakVisible={false}
            setInitialFocus={true}
            directionalHint={DirectionalHint.topRightEdge}
          >
            <div className={this._classNames.hoverCardRoot}>
              <div className={this._classNames.hoverCardTextStyles}>{this.state.selectedLegendTitle}</div>
              <div className={this._classNames.hoverCardDataStyles}>{this.state.dataForHoverCard}</div>
            </div>
          </Callout>
        ) : null}
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
    this._reqID = requestAnimationFrame(() => {
      const legendContainerComputedStyles = getComputedStyle(this.legendContainer);
      const legendContainerHeight =
        (this.legendContainer.getBoundingClientRect().height || this.minLegendContainerHeight) +
        parseFloat(legendContainerComputedStyles.marginTop || '0') +
        parseFloat(legendContainerComputedStyles.marginBottom || '0');
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

  private getXAxisLabels = (): Array<string> => {
    // to get what lables show we show at x-axis labels | may be from props also otherwise we need to form
    if (this._xAxisLabels && this._xAxisLabels.length > 0) {
      return this._xAxisLabels;
    } else {
      const xAxisLabels: string[] = [];
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
    this._keys = Object.keys(dataSet[0]).map((key: string) => key);
    return dataSet;
  };

  private _createStringXAxis(xAxisLabels: string[]): stringAxis {
    const xAxisScale = d3ScaleBand()
      .domain(xAxisLabels.map((label: string) => label))
      .range([0, this.state.containerWidth - this.margins.right])
      .paddingOuter(10); // check padding

    // const x1Scale = d3ScaleBand()
    //   .domain(this._keys)
    //   .rangeRound([0, xAxisScale.bandwidth()])
    //   .padding(10); // need to check use of this
    // this._x1Scale = x1Scale;

    const xAxis = d3AxisBottom(xAxisScale)
      .tickFormat((x: string, index: number) => xAxisLabels[index])
      .tickPadding(10);

    this._showXAxisGridLines && // we can show x-axis grid lines also based on prop values
      xAxis.tickSizeInner(-(this.state.containerHeight - this.margins.bottom - this.margins.top));
    return xAxis;
  }

  private _createYAxis(dataset: any[]): numericAxis {
    const yMax: number = d3Max(dataset, (point: any) => d3Max(this._keys, (key: string) => point[key]));
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

    this._showYAxisGridLines &&
      yAxis.tickSizeInner(-(this.state.containerWidth - this.margins.left - this.margins.right));

    return yAxis;
  }

  private _refCallback(element: SVGRectElement, legendTitle: string, index: number): void {
    this._refArray[index] = { legendText: legendTitle, refElement: element };
  }

  private _onBarLeave = (): void => {
    this.setState({
      isCalloutVisible: false,
    });
  };

  private _onBarHover(
    customMessage: string,
    pointData: number,
    color: string,
    mouseEvent: React.MouseEvent<SVGPathElement>,
  ): void {
    mouseEvent.persist();
    if (
      this.state.isLegendSelected === false ||
      (this.state.isLegendSelected && this.state.selectedLegendTitle === customMessage)
    ) {
      this.setState({
        refSelected: mouseEvent,
        isCalloutVisible: true,
        selectedLegendTitle: customMessage,
        dataForHoverCard: pointData,
        color: color,
      });
    }
  }

  private _onBarFocus(legendText: string, pointData: number, color: string, refArrayIndexNumber: number): void {
    if (
      this.state.isLegendSelected === false ||
      (this.state.isLegendSelected && this.state.selectedLegendTitle === legendText)
    ) {
      this._refArray.map((obj: IRefArrayData, index: number) => {
        if (obj.legendText === legendText && refArrayIndexNumber === index) {
          this.setState({
            refSelected: obj.refElement,
            isCalloutVisible: true,
            selectedLegendTitle: legendText,
            dataForHoverCard: pointData,
            color: color,
          });
        }
      });
    }
  }

  private _redirectToUrl(href: string | undefined): void {
    href ? (window.location.href = href) : '';
  }

  private _createBar = (
    singleDataPoint: IGroupedVerticalBarChartDataPoint,
    indexNumber: number,
    yBarScale: numericAxis,
    starting: number,
    ending: number,
    xbarVal: number,
    xbarEnding: number,
  ): JSX.Element[] => {
    // (this.state.containerWidth - this.margins.right) = this.state._width
    const bar = singleDataPoint.series.map((point: any, index: number) => {
      const refArrayIndexNumber = indexNumber * singleDataPoint.series.length + index;
      const color = point.color ? point.color : this._colors[index];

      let shouldHighlight = true;
      if (this.state.isLegendHovered || this.state.isLegendSelected) {
        shouldHighlight = this.state.selectedLegendTitle === point.legend;
      }

      const { theme, styles, className, href } = this.props;

      this._classNames = getClassNames(styles!, {
        theme: theme!,
        width: this.state.containerWidth,
        height: this.state.containerHeight,
        className: className,
        shouldHighlight: shouldHighlight,
        href: href,
        legendColor: this.state.color,
      });
      const ss = this.margins.left + xbarVal + this._barWidth * index + this._barPadding * index;
      return (
        <rect
          key={index + indexNumber}
          className={this._classNames.opacityChangeOnHover}
          x={ss}
          y={this.state.containerHeight - this.margins.bottom - yBarScale(point.data)}
          width={this._barWidth}
          height={yBarScale(point.data)}
          fill={point.color}
          ref={(e: SVGRectElement) => {
            this._refCallback(e, point.legend, refArrayIndexNumber);
          }}
          data-is-focusable={true}
          focusable={'true'}
          onMouseOver={this._onBarHover.bind(this, point.legend, point.data, color)}
          onMouseMove={this._onBarHover.bind(this, point.legend, point.data, color)}
          onMouseLeave={this._onBarLeave}
          onFocus={this._onBarFocus.bind(this, point.legend, point.data, color, refArrayIndexNumber)}
          onBlur={this._onBarLeave}
          onClick={this._redirectToUrl.bind(this, this.props.href)}
        />
      );
    });
    return bar;
  };

  private _getBars = (): JSX.Element[] => {
    const groupBars: JSX.Element[] = [];

    const xMax = this.state.containerWidth - this.margins.left - this.margins.right;
    const interval = Math.ceil(xMax / this._xAxisTickCount);
    const xdomains: Array<number> = [0];
    while (xdomains[xdomains.length - 1] < xMax) {
      xdomains.push(xdomains[xdomains.length - 1] + interval);
    }

    const xBarScale = d3ScaleLinear()
      .domain([0, this._xAxisTickCount])
      .range([0, this.state.containerWidth - this.margins.right]);

    const yBarScale = d3ScaleLinear()
      .domain([0, this._yMax])
      .range([0, this.state.containerHeight - this.margins.bottom - this.margins.top]);

    this._points.map((singleDataPoint: IGroupedVerticalBarChartDataPoint, index: number) => {
      const singleGroupSlot = this._createBar(
        singleDataPoint,
        index,
        yBarScale,
        xdomains[index],
        xdomains[index + 1],
        xBarScale(index),
        xBarScale(index + 1),
      );
      groupBars.push(singleGroupSlot);
    });
    return groupBars;
  };

  private _onLegendClick(customMessage: string): void {
    if (this.state.isLegendSelected) {
      if (this.state.selectedLegendTitle === customMessage) {
        this.setState({
          isLegendSelected: false,
          selectedLegendTitle: customMessage,
        });
      } else {
        this.setState({
          selectedLegendTitle: customMessage,
        });
      }
    } else {
      this.setState({
        isLegendSelected: true,
        selectedLegendTitle: customMessage,
      });
    }
  }

  private _onLegendHover(customMessage: string): void {
    if (this.state.isLegendSelected === false) {
      this.setState({
        isLegendHovered: true,
        selectedLegendTitle: customMessage,
      });
    }
  }

  private _onLegendLeave(isLegendFocused?: boolean): void {
    if (!!isLegendFocused || this.state.isLegendSelected === false) {
      this.setState({
        isLegendHovered: false,
        selectedLegendTitle: '',
        isLegendSelected: !!isLegendFocused ? false : this.state.isLegendSelected,
      });
    }
  }

  private _getLegendData = (palette: IPalette): JSX.Element => {
    const data = this._points;
    const defaultPalette: string[] = [palette.blueLight, palette.blue, palette.blueMid, palette.red, palette.black];
    const actions: ILegend[] = [];

    data.map((singleChartData: IGroupedVerticalBarChartDataPoint) => {
      singleChartData.series.map((point: any) => {
        const color: string = point.color ? point.color : defaultPalette[Math.floor(Math.random() * 4 + 1)];
        const checkSimilarLegends = actions.filter((leg: ILegend) => leg.title === point.legend && leg.color === color);
        if (checkSimilarLegends!.length > 0) {
          return;
        }

        const legend: ILegend = {
          title: point.legend,
          color: color,
          action: () => {
            this._onLegendClick(point.legend);
          },
          hoverAction: () => {
            this._onLegendHover(point.legend);
          },
          onMouseOutAction: (isLegendSelected?: boolean) => {
            this._onLegendLeave(isLegendSelected);
          },
        };

        actions.push(legend);
      });
    });
    return (
      <Legends
        legends={actions}
        overflowProps={this.props.legendsOverflowProps}
        enabledWrapLines={this.props.enabledLegendsWrapLines}
        focusZonePropsInHoverCard={this.props.focusZonePropsForLegendsInHoverCard}
      />
    );
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
