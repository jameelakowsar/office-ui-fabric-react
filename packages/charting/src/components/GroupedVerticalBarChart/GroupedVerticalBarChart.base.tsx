import * as React from 'react';
import { max as d3Max } from 'd3-array';
// import { Axis as D3Axis } from 'd3-axis';
import { scaleBand as d3ScaleBand, scaleLinear as d3ScaleLinear } from 'd3-scale';
// import { select as d3Select } from 'd3-selection';
import { classNamesFunction, getId, getRTL } from 'office-ui-fabric-react/lib/Utilities';
import { IProcessedStyleSet, IPalette } from 'office-ui-fabric-react/lib/Styling';
import { DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { XAxisTypes } from '../../utilities/index'; // createWrapOfXLabels, tooltipOfXAxislabels,
import { warnDeprecations } from 'office-ui-fabric-react/lib/Utilities';
import {
  ILegend,
  IGroupedVerticalBarChartData,
  IGroupedVerticalBarChartProps,
  IGroupedVerticalBarChartStyleProps,
  IGroupedVerticalBarChartStyles,
  IGVDataPoint,
  // IGVForBarChart,
  IGVSingleDataPoint,
  IGVBarChartSeriesPoint,
  IMargins,
  IBasestate,
  IRefArrayData,
  Legends,
} from '../../index';
import { ChartTypes } from '../../utilities/index';
import { CartesianChart } from '../CommonComponents/CartesianChart';

const COMPONENT_NAME = 'GROUPED VERTICAL BAR CHART';
const getClassNames = classNamesFunction<IGroupedVerticalBarChartStyleProps, IGroupedVerticalBarChartStyles>();
// type StringAxis = D3Axis<string>;
// type NumericAxis = D3Axis<number | { valueOf(): number }>;
export interface IGroupedVerticalBarChartState extends IBasestate {
  titleForHoverCard: string;
  dataPointCalloutProps?: IGVBarChartSeriesPoint;
}

export class GroupedVerticalBarChartBase extends React.Component<
  IGroupedVerticalBarChartProps,
  IGroupedVerticalBarChartState
> {
  private _points: IGroupedVerticalBarChartData[];
  private _xAxisLabels: string[];
  private _groupedVerticalBarGraph: JSX.Element[];
  private _barWidth: number;
  private _groupPadding: number = 16;
  private _classNames: IProcessedStyleSet<IGroupedVerticalBarChartStyles>;
  private _refArray: IRefArrayData[];
  private _yMax: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _datasetForBars: any;
  private _calloutId: string;
  private _dataset: IGVDataPoint[];
  private _keys: string[];
  // private _xAxis: any;
  private _isNumeric: boolean;
  private _removalValue: number = 0;
  private margins: IMargins;
  private _isRtl: boolean = getRTL();
  // private _tooltipId: string;

  public constructor(props: IGroupedVerticalBarChartProps) {
    super(props);
    this.state = {
      color: '',
      dataForHoverCard: 0,
      isCalloutVisible: false,
      isLegendSelected: false,
      isLegendHovered: false,
      refSelected: null,
      titleForHoverCard: '',
      xCalloutValue: '',
      yCalloutValue: '',
    };
    warnDeprecations(COMPONENT_NAME, props, {
      showYAxisGridLines: 'Dont use this property. Lines are drawn by default',
      showXAxisPath: 'Dont use this property. Axis line removed default.',
      showYAxisPath: 'Dont use this property. No need to display Y axis path. Handling default',
      showXAxisGridLines: 'Dont use this proprty. Handling with default value.',
      legendColor: 'Dont use this property. colour will pick from given data.',
    });
    this._refArray = [];
    this._calloutId = getId('callout');
    // this._tooltipId = getId('GVBCTooltipId_');
    this._adjustProps();
  }

  public render(): React.ReactNode {
    // take care of removal values
    // RTL
    this._adjustProps();
    this._xAxisLabels = this._createXAxisProperties();
    this._datasetForBars = this._createDataset();
    this._isNumeric = this._points.length > 0 && typeof this._points[0].name === 'number';
    const legends: JSX.Element = this._getLegendData(this.props.theme!.palette);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yMax = d3Max(this._dataset, (point: any) => d3Max(this._keys, (key: string) => point[key]));
    this._yMax = Math.max(yMax, this.props.yMaxValue || 0);
    this._classNames = getClassNames(this.props.styles!, {
      theme: this.props.theme!,
      href: this.props.href,
    });
    const calloutProps = {
      target: this.state.refSelected,
      isCalloutVisible: this.state.isCalloutVisible,
      directionalHint: DirectionalHint.topRightEdge,
      id: `toolTip${this._calloutId}`,
      gapSpace: 15,
      isBeakVisible: false,
      setInitialFocus: true,
      color: this.state.color,
      Legend: this.state.titleForHoverCard,
      XValue: this.state.xCalloutValue,
      YValue: this.state.yCalloutValue ? this.state.yCalloutValue : this.state.dataForHoverCard,
      ...this.props.calloutProps,
    };
    const tickParams = {
      tickValues: this.props.tickValues!,
      tickFormat: this.props.tickFormat!,
    };

    return (
      <CartesianChart
        {...this.props}
        points={this._datasetForBars}
        chartType={ChartTypes.GroupedVerticalBarChart}
        calloutProps={calloutProps}
        legendBars={legends}
        xAxisType={this._isNumeric ? XAxisTypes.NumericAxis : XAxisTypes.StringAxis}
        datasetForXAxisDomain={this._xAxisLabels}
        tickParams={tickParams}
        isCalloutForStack={false}
        maxOfYVal={this._yMax}
        customizedCallout={this._getCustomizedCallout()}
        getmargins={this._getMargins}
        getGraphData={this._getGraphData}
        /* eslint-disable react/jsx-no-bind */
        // eslint-disable-next-line react/no-children-prop
        children={() => {
          return <g>{this._groupedVerticalBarGraph}</g>;
        }}
      />
      //         <g
      //           id="xAxisGElement"
      //       ref={(node: SVGGElement | null) => this._setXAxis(node, x0Axis)}
      //       className={this._classNames.xAxis}
      //       transform={`translate(0, ${svgDimensions.height - 35 - this._removalValue})`}
      //     />
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _getGraphData = (xAxis: any, yAxis: any, containerHeight: number, containerWidth: number) => {
    this._groupedVerticalBarGraph = this._getGraphBars(containerHeight, containerWidth); // check what data needs to
  };

  private _adjustProps(): void {
    this._points = this.props.data || [];
    this._barWidth = this.props.barwidth!;
  }

  private _getMargins = (margins: IMargins) => (this.margins = margins);

  private _getCustomizedCallout = () => {
    return this.props.onRenderCalloutPerDataPoint
      ? this.props.onRenderCalloutPerDataPoint(this.state.dataPointCalloutProps)
      : null;
  };

  private _getOpacity = (legendTitle: string): string => {
    let shouldHighlight = true;
    if (this.state.isLegendHovered || this.state.isLegendSelected) {
      shouldHighlight = this.state.titleForHoverCard === legendTitle;
    }
    return shouldHighlight ? '' : '0.1';
  };

  private _getGraphBars = (containerHeight: number, containerWidth: number): JSX.Element[] => {
    const xScale0 = this._createX0Scale(containerWidth);
    const xScale1 = this._createX1Scale(xScale0);
    const allGroupsBars: JSX.Element[] = [];
    this._datasetForBars.forEach((singleSet: IGVSingleDataPoint) => {
      allGroupsBars.push(this._buildGraph(singleSet, xScale0, xScale1, containerHeight));
    });
    return allGroupsBars;
  };

  private _onBarHover = (pointData: IGVBarChartSeriesPoint, mouseEvent: React.MouseEvent<SVGPathElement>): void => {
    mouseEvent.persist();
    if (
      this.state.isLegendSelected === false ||
      (this.state.isLegendSelected && this.state.titleForHoverCard === pointData.legend)
    ) {
      this.setState({
        refSelected: mouseEvent,
        isCalloutVisible: true,
        titleForHoverCard: pointData.legend,
        dataForHoverCard: pointData.data,
        color: pointData.color,
        xCalloutValue: pointData.xAxisCalloutData,
        yCalloutValue: pointData.yAxisCalloutData,
        dataPointCalloutProps: pointData,
      });
    }
  };

  private _onBarLeave = (): void => {
    this.setState({
      isCalloutVisible: false,
    });
  };

  private _onBarFocus = (pointData: IGVBarChartSeriesPoint, refArrayIndexNumber: number): void => {
    if (
      this.state.isLegendSelected === false ||
      (this.state.isLegendSelected && this.state.titleForHoverCard === pointData.legend)
    ) {
      this._refArray.forEach((obj: IRefArrayData, index: number) => {
        if (obj.index === pointData.legend && refArrayIndexNumber === index) {
          this.setState({
            refSelected: obj.refElement,
            isCalloutVisible: true,
            titleForHoverCard: pointData.legend,
            dataForHoverCard: pointData.data,
            color: pointData.color,
            xCalloutValue: pointData.xAxisCalloutData,
            yCalloutValue: pointData.yAxisCalloutData,
            dataPointCalloutProps: pointData,
          });
        }
      });
    }
  };

  private _redirectToUrl = (href: string | undefined): void => {
    href ? (window.location.href = href) : '';
  };

  private _refCallback(element: SVGRectElement, legendTitle: string, refIndexNumber: number): void {
    this._refArray[refIndexNumber] = { index: legendTitle, refElement: element };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _buildGraph = (singleSet: any, xScale0: any, xScale1: any, containerHeight: number): JSX.Element => {
    const singleGroup: JSX.Element[] = [];

    const yBarScale = d3ScaleLinear() // check rtl support
      .domain([0, this._yMax])
      .range([0, containerHeight! - this._removalValue - this.margins.bottom! - this.margins.top!]);

    let widthOfBar: number;
    if (this._barWidth && this._barWidth < xScale1.bandwidth()) {
      widthOfBar = this._barWidth;
    } else {
      widthOfBar = xScale1.bandwidth();
    }
    const tempDataSet = Object.keys(this._datasetForBars[0]).splice(0, this._keys.length);
    tempDataSet.forEach((datasetKey: string, index: number) => {
      const refIndexNumber = singleSet.indexNum * tempDataSet.length + index;
      const pointData = singleSet[datasetKey];
      singleGroup.push(
        <rect
          className={this._classNames.opacityChangeOnHover}
          key={`${singleSet.indexNum}-${index}`}
          height={Math.max(yBarScale(pointData.data), 0)}
          width={widthOfBar}
          x={xScale1(datasetKey)!}
          y={containerHeight! - this._removalValue - this.margins.bottom! - yBarScale(pointData.data)}
          data-is-focusable={true}
          opacity={this._getOpacity(pointData.legend)}
          ref={(e: SVGRectElement | null) => {
            this._refCallback(e!, pointData.legend, refIndexNumber);
          }}
          fill={pointData.color}
          onMouseOver={this._onBarHover.bind(this, pointData)}
          onMouseMove={this._onBarHover.bind(this, pointData)}
          onMouseOut={this._onBarLeave}
          onFocus={this._onBarFocus.bind(this, pointData, refIndexNumber)}
          onBlur={this._onBarLeave}
          onClick={this._redirectToUrl.bind(this, this.props.href!)}
        />,
      );
    });
    // if (!this.props.wrapXAxisLables && this.props.showXAxisLablesTooltip) {
    //   try {
    //     document.getElementById(this._tooltipId) && document.getElementById(this._tooltipId)!.remove();
    //     // eslint-disable-next-line no-empty
    //   } catch (e) {}
    //   const tooltipProps = {
    //     tooltipCls: this._classNames.tooltip!,
    //     id: this._tooltipId,
    //     xAxis: this._xAxis,
    //   };
    //   tooltipOfXAxislabels(tooltipProps);
    // }
    return (
      <g key={singleSet.indexNum} transform={`translate(${xScale0(singleSet.xAxisPoint)}, 0)`}>
        {singleGroup}
      </g>
    );
  };

  private _createXAxisProperties = (): string[] => {
    const keys: string[] = [];
    const colors: string[] = [];
    const xAxisLabels: string[] = this._points.map(singlePoint => singlePoint.name);
    this._points[0].series.forEach((singleKey: IGVBarChartSeriesPoint) => {
      keys.push(singleKey.key);
      colors.push(singleKey.color);
    });
    this._keys = keys;
    return xAxisLabels;
  };

  private _createDataset = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const datasetForBars: any = [];
    const dataset: IGVDataPoint[] = [];

    this._points.forEach((point: IGroupedVerticalBarChartData, index: number) => {
      const singleDatasetPoint: IGVDataPoint = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const singleDatasetPointforBars: any = {};

      point.series.forEach((seriesPoint: IGVBarChartSeriesPoint) => {
        singleDatasetPoint[seriesPoint.key] = seriesPoint.data;
        singleDatasetPointforBars[seriesPoint.key] = {
          ...seriesPoint,
        };
      });

      singleDatasetPointforBars.xAxisPoint = point.name;
      singleDatasetPointforBars.indexNum = index;

      datasetForBars.push(singleDatasetPointforBars);
      dataset.push(singleDatasetPoint);
    });
    this._dataset = dataset;
    return datasetForBars;
  };

  private _createX0Scale = (containerWidth: number) => {
    const x0Axis = d3ScaleBand()
      .domain(this._xAxisLabels)
      .range([this.margins.left!, containerWidth! - this.margins.right!])
      .padding(this._groupPadding / 100);
    return x0Axis;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _createX1Scale = (xScale0: any): any => {
    return d3ScaleBand()
      .domain(this._keys)
      .range(this._isRtl ? [xScale0.bandwidth(), 0] : [0, xScale0.bandwidth()])
      .padding(0.05);
  };

  private _onLegendClick(customMessage: string): void {
    if (this.state.isLegendSelected) {
      if (this.state.titleForHoverCard === customMessage) {
        this.setState({
          isLegendSelected: false,
          titleForHoverCard: customMessage,
        });
      } else {
        this.setState({
          titleForHoverCard: customMessage,
        });
      }
    } else {
      this.setState({
        isLegendSelected: true,
        titleForHoverCard: customMessage,
      });
    }
  }

  private _onLegendHover(customMessage: string): void {
    if (this.state.isLegendSelected === false) {
      this.setState({
        isLegendHovered: true,
        titleForHoverCard: customMessage,
      });
    }
  }

  private _onLegendLeave(isLegendFocused?: boolean): void {
    if (!!isLegendFocused || this.state.isLegendSelected === false) {
      this.setState({
        isLegendHovered: false,
        titleForHoverCard: '',
        isLegendSelected: isLegendFocused ? false : this.state.isLegendSelected,
      });
    }
  }

  private _getLegendData = (palette: IPalette): JSX.Element => {
    const data = this._points;
    const defaultPalette: string[] = [palette.blueLight, palette.blue, palette.blueMid, palette.red, palette.black];
    const actions: ILegend[] = [];

    data.forEach((singleChartData: IGroupedVerticalBarChartData) => {
      singleChartData.series.forEach((point: IGVBarChartSeriesPoint) => {
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
        {...this.props.legendProps}
      />
    );
  };

  // private _setXAxis(node: SVGGElement | null, xAxis: NumericAxis | StringAxis): void {
  //   if (node === null) {
  //     return;
  //   }
  //   this._xAxis = d3Select(node).call(xAxis);
  //   const wrapLabelProps = {
  //     node: node,
  //     xAxis: xAxis,
  //     showXAxisLablesTooltip: this.props.showXAxisLablesTooltip || false,
  //     noOfCharsToTruncate: this.props.noOfCharsToTruncate || 4,
  //   };
  //   let temp = 0;
  //   if (this.props.wrapXAxisLables || this.props.showXAxisLablesTooltip) {
  //     temp = createWrapOfXLabels(wrapLabelProps) as number;
  //   }
  //   this._removalValue = temp;
  // }
}
