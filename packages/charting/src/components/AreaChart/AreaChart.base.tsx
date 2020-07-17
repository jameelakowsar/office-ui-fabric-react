import * as React from 'react';
import { max as d3Max, min as d3Min } from 'd3-array';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import { select as d3Select, event as d3Event } from 'd3-selection';
import { area as d3Area, stack as d3Stack, curveMonotoneX as d3CurveBasis } from 'd3-shape';
import { classNamesFunction, getId } from 'office-ui-fabric-react/lib/Utilities';
import { IProcessedStyleSet, IPalette, mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { ILineChartProps, ILineChartStyleProps, ILineChartStyles } from '../LineChart/index';
import { ILegend, Legends } from '../Legends/index';
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { ILineChartDataPoint, ILineChartPoints } from '../../types/index';
import { calloutData, createNumericXAxis, createDateXAxis, createYAxis } from '../../utilities/index';
import { Base } from '../CommonComponents/ChartModule';

const getClassNames = classNamesFunction<ILineChartStyleProps, ILineChartStyles>();

export interface IRefArrayData {
  legendText?: string;
  refElement?: SVGGElement;
}
export interface IAreaChartAreaPoint {
  xVal: string | number;
  values: IAreaChartDataSetPoint;
}
export interface IAreaChartDataSetPoint {
  [key: string]: number | string;
}
export interface IDPointType {
  index: number;
  point: {
    values: { 0: number; 1: number; data: {} };
    xVal: number;
  };
}
export interface IContainerValues {
  width: number;
  height: number;
  shouldResize: boolean;
  reqID: number;
}
export interface IAreaChartState {
  _width: number;
  _height: number;
  activeLegend: string;
  color: string;
  // containerWidth: number;
  // containerHeight: number;
  dataForHoverCard: number;
  isCalloutVisible: boolean;
  isLegendSelected: boolean;
  isLegendHovered: boolean;
  // tslint:disable-next-line:no-any
  refSelected: any;
  YValueHover: { legend?: string; y?: number; color?: string }[];
  hoverYValue: string | number | null;
  hoverXValue: string | number | null;
  xCalloutValue?: string;
  yCalloutValue?: string;
}
export interface IChildProps {
  containerWidth: number;
  containerHeight: number;
  x?: any;
  y?: any;
}

export class AreaChartBase extends React.Component<ILineChartProps, IAreaChartState> {
  // tslint:disable-next-line:no-any
  private _calloutPoints: any;
  private _points: ILineChartPoints[];
  private _classNames: IProcessedStyleSet<ILineChartStyles>;
  // tslint:disable-next-line:no-any
  private dataSet: any;
  private _colors: string[];
  private _keys: string[];
  private _refArray: IRefArrayData[];
  private _isGraphDraw: boolean = true;
  private _uniqueIdForGraph: string;
  private _verticalLineId: string;
  private _callOutId: string;
  private containerHeight: number = this.props.height!;
  private containerWidth: number = this.props.width!;
  private _xAxisScale: any;
  private _yAxisScale: any;
  private xAxisElement: SVGElement | null;
  private yAxisElement: SVGElement | null;
  private containerParams: IContainerValues;
  private chartContainer: HTMLDivElement;
  private legendContainer: HTMLDivElement;
  // These margins are necessary for d3Scales to appear without cutting off
  private margins = { top: 20, right: 20, bottom: 35, left: 40 };

  public constructor(props: ILineChartProps) {
    super(props);
    this.state = {
      _width: this.props.width || 600,
      _height: this.props.height || 350,
      activeLegend: '',
      color: '',
      // containerHeight: 0,
      // containerWidth: 0,
      dataForHoverCard: 0,
      hoverYValue: '',
      hoverXValue: '',
      isCalloutVisible: false,
      isLegendSelected: false,
      isLegendHovered: false,
      refSelected: null,
      YValueHover: [],
      xCalloutValue: '',
      yCalloutValue: '',
    };
    this._refArray = [];
    this._points = this.props.data.lineChartData ? this.props.data.lineChartData : [];
    this._uniqueIdForGraph = getId('areaChart_');
    this._verticalLineId = getId('verticalLine_');
    this._calloutPoints = this.props.data.lineChartData ? calloutData(this.props.data.lineChartData!) : [];
    this.dataSet = this._createDataSet();
  }

  public componentDidUpdate(prevProps: ILineChartProps): void {
    if (
      prevProps.data !== this.props.data ||
      prevProps.height !== this.props.height ||
      prevProps.width !== this.props.width ||
      this._isGraphDraw
    ) {
      this._points = this.props.data.lineChartData ? this.props.data.lineChartData : [];
      this.dataSet = this._createDataSet();
      this._calloutPoints = this.props.data.lineChartData ? calloutData(this.props.data.lineChartData!) : [];
      // this._drawGraph();
      this._isGraphDraw = false;
    }
  }

  public componentWillUnmount(): void {
    d3Select(`#firstGElementForChart123_${this._uniqueIdForGraph}`).remove();
  }

  public render(): JSX.Element {
    const { theme, className, styles, tickValues, tickFormat } = this.props;
    const xMax = d3Max(this._points, (point: ILineChartPoints) => {
      return d3Max(point.data, (item: ILineChartDataPoint) => item.x as number);
    })!;
    const xMin = d3Min(this._points, (point: ILineChartPoints) => {
      return d3Min(point.data, (item: ILineChartDataPoint) => item.x);
    })!;
    const xScale = d3ScaleLinear()
      .range([this.margins.left, this.containerWidth - this.margins.right])
      .domain([xMin, xMax]);

    this._points[0].data[0].x instanceof Date ? xScale : xScale.nice();

    let isDateType = false;
    if (this._points && this._points.length > 0) {
      this._points.map((chartData: ILineChartPoints) => {
        if (chartData.data.length > 0) {
          isDateType = chartData.data[0].x instanceof Date;
          return;
        }
      });
    }

    this._keys = this._createKeys();
    const legends: JSX.Element = this._getLegendData(this.props.theme!.palette);
    this._classNames = getClassNames(styles!, {
      theme: theme!,
      width: this.state._width,
      height: this.state._height,
      className,
    });
    console.log(this.state.refSelected, 'selected ref');

    const calloutProps = {
      target: this.state.refSelected,
      isCalloutVisible: this.state.isCalloutVisible,
      refSelected: this.state.refSelected,
      directionalHint: DirectionalHint.topRightEdge,
      YValueHover: this.state.YValueHover,
      hoverXValue: this.state.hoverXValue,
      id: this._callOutId, // change as per axe tool
      gapSpace: 15,
      isBeakVisible: false,
      setInitialFocus: true,
    };
    const tickParams = {
      tickValues: tickValues,
      tickFormat: tickFormat,
    };
    return (
      <Base
        data={this._points}
        width={this.props.width!}
        height={this.props.height!}
        tickParams={tickParams}
        getGraphData={this._getGraphData}
        calloutProps={calloutProps}
        legendBars={legends}
        isXAxisDateType={isDateType}
        // tslint:disable-next-line:jsx-no-lambda
        render={(props: IChildProps) => {
          this.containerHeight = props.containerHeight;
          this.containerWidth = props.containerWidth!;
          return <g id={`graphGElement_${this._uniqueIdForGraph}`} />;
        }}
      />
    );
  }

  private _createDataSet = () => {
    let allChartPoints: ILineChartDataPoint[] = [];
    const dataSet: IAreaChartDataSetPoint[] = [];
    this._points.length &&
      this._points.map((singleChartPoint: ILineChartPoints) => {
        allChartPoints = [...allChartPoints, ...singleChartPoint.data];
      });

    let tempArr = allChartPoints;
    while (tempArr.length) {
      const valToCheck = tempArr[0].x instanceof Date ? tempArr[0].x.toLocaleDateString() : tempArr[0].x;
      const filteredChartPoints: ILineChartDataPoint[] = tempArr.filter(
        (point: ILineChartDataPoint) =>
          (point.x instanceof Date ? point.x.toLocaleDateString() : point.x) === valToCheck,
      );
      // tslint:disable-next-line:no-any
      const singleDataset: any = {};
      filteredChartPoints.map((singleDataPoint: ILineChartDataPoint, index: number) => {
        singleDataset.xVal = singleDataPoint.x;
        singleDataset[`chart${index}`] = singleDataPoint.y;
      });
      dataSet.push(singleDataset);
      // removing compared objects from array
      const val = tempArr[0].x instanceof Date ? tempArr[0].x.toLocaleDateString() : tempArr[0].x;
      tempArr = tempArr.filter(
        (point: ILineChartDataPoint) => (point.x instanceof Date ? point.x.toLocaleDateString() : point.x) !== val,
      );
    }
    return dataSet;
  };

  private _getColors = (): string[] => {
    return this._points.map((singlePoint: ILineChartPoints) => singlePoint.color);
  };

  private _createKeys = (): string[] => {
    const keysLength: number = Object.keys(this.dataSet[0]).length;
    const keys: string[] = [];
    for (let i = 0; i < keysLength - 1; i++) {
      const keyVal = `chart${i}`;
      keys.push(keyVal);
    }
    return keys;
  };

  private _getGraphData = (xScale: any, yScale: any, containerHeight: number, containerWidth: number) => {
    this._xAxisScale = xScale;
    this._yAxisScale = yScale;
    return this._drawGraph(containerHeight, containerWidth);
  };

  private _onLegendClick(customMessage: string): void {
    if (this.state.isLegendSelected) {
      if (this.state.activeLegend === customMessage) {
        this.setState({
          isLegendSelected: false,
          activeLegend: '',
        });
      } else {
        this.setState({
          activeLegend: customMessage,
        });
      }
    } else {
      this.setState({
        activeLegend: customMessage,
      });
    }
    this._isGraphDraw = true;
  }

  private _onLegendHover(customMessage: string): void {
    if (this.state.isLegendSelected === false) {
      this.setState({
        activeLegend: customMessage,
        isLegendHovered: true,
      });
      this._isGraphDraw = true;
    }
  }

  private _onLegendLeave(isLegendFocused?: boolean): void {
    if (!!isLegendFocused || this.state.isLegendSelected === false) {
      this.setState({
        activeLegend: '',
        isLegendHovered: false,
        isLegendSelected: !!isLegendFocused ? false : this.state.isLegendSelected,
      });
      this._isGraphDraw = true;
    }
  }

  private _getLegendData = (palette: IPalette): JSX.Element => {
    const data = this._points;
    const defaultPalette: string[] = [palette.blueLight, palette.blue, palette.blueMid, palette.red, palette.black];
    const actions: ILegend[] = [];

    data.map((singleChartData: ILineChartPoints) => {
      const color: string = singleChartData.color
        ? singleChartData.color
        : defaultPalette[Math.floor(Math.random() * 4 + 1)];
      const checkSimilarLegends = actions.filter(
        (leg: ILegend) => leg.title === singleChartData.legend && leg.color === color,
      );
      if (checkSimilarLegends!.length > 0) {
        return;
      }

      const legend: ILegend = {
        title: singleChartData.legend,
        color: color,
        action: () => {
          this._onLegendClick(singleChartData.legend);
        },
        hoverAction: () => {
          this._onLegendHover(singleChartData.legend);
        },
        onMouseOutAction: (isLegendSelected?: boolean) => {
          this._onLegendLeave(isLegendSelected);
        },
      };

      actions.push(legend);
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

  private updateVerticalLine = (xLineVal: number, visibilityStatus: string) => {
    d3Select(`#${this._verticalLineId}`).attr('x1', xLineVal);
    d3Select(`#${this._verticalLineId}`).attr('x2', xLineVal);
    d3Select(`#${this._verticalLineId}`).attr('visibility', visibilityStatus);
  };

  private onMouseHover = (target: SVGCircleElement, x: number | Date, xAxisCalloutData: string) => {
    const formattedDate = x instanceof Date ? x.toLocaleDateString() : x;
    const found = this._calloutPoints.find((element: { x: string | number }) => element.x === formattedDate);
    const presentData = found.values[0];
    if (
      this.state.isLegendSelected === false ||
      (this.state.isLegendSelected && this.state.activeLegend === presentData.legend)
    ) {
      this.setState({
        refSelected: target,
        isCalloutVisible: true,
        activeLegend: presentData.legend,
        dataForHoverCard: presentData.y,
        hoverXValue: xAxisCalloutData ? xAxisCalloutData : formattedDate,
        YValueHover: found.values,
        color: presentData.color,
      });
    }
  };

  private handleMouseAction = (xLineVal: number, x: number | Date, refArrayIndex: string, xAxisCalloutData: string) => {
    console.log(refArrayIndex, 'on mouse index');
    d3Select(`#dot${refArrayIndex}`)
      .attr('fill', '#fff')
      .attr('r', 8);
    // .attr('aria-labelledby', this._callOutId);
    this._callOutId = refArrayIndex;
    this.updateVerticalLine(xLineVal, 'visibility');
    this.onMouseHover(d3Event.target, x, xAxisCalloutData);
  };

  private mouseOutAction = (refArrayIndex: string, color: string) => {
    console.log(refArrayIndex, 'mouse out actions');
    this.updateVerticalLine(0, 'hidden');
    d3Select(`#dot${refArrayIndex}`)
      .attr('fill', color)
      .attr('r', 0.01);
    this.setState({
      isCalloutVisible: false,
    });
  };

  private onChartFocus = (
    target: SVGCircleElement,
    refArrayIndex: string,
    x: number | Date,
    xAxisCalloutData: string,
  ) => {
    const formattedDate = x instanceof Date ? x.toLocaleDateString() : x;
    const found = this._calloutPoints.find((element: { x: string | number }) => element.x === formattedDate);
    const presentData = found.values[0];
    if (
      this.state.isLegendSelected === false ||
      (this.state.isLegendSelected && this.state.activeLegend === presentData.legend)
    ) {
      this._refArray.map((obj: IRefArrayData) => {
        if (obj.legendText === refArrayIndex) {
          this.setState({
            refSelected: obj.refElement,
            isCalloutVisible: true,
            activeLegend: presentData.legend,
            dataForHoverCard: presentData.y,
            color: presentData.color,
            hoverXValue: xAxisCalloutData ? xAxisCalloutData : formattedDate,
            YValueHover: found.values,
          });
        }
      });
    }
  };

  private handleFocusAction = (
    xLineVal: number,
    x: number | Date,
    legendTitle: string,
    refArrayIndex: string,
    xAxisCalloutData: string,
  ) => {
    this._callOutId = refArrayIndex;
    this._refArray.push({ legendText: refArrayIndex, refElement: d3Event.target });
    d3Select(`#dot${refArrayIndex}`)
      .attr('fill', '#fff')
      .attr('r', 8)
      .attr('aria-labelledby', this._callOutId);
    this.updateVerticalLine(xLineVal, 'visibility');
    this.onChartFocus(d3Event.target, refArrayIndex, x, xAxisCalloutData);
  };

  private onDataPointClick = (func: () => void, refArrayIndex: string, color: string) => {
    d3Select(`#dot${refArrayIndex}`)
      .attr('fill', color)
      .attr('r', 8);
    if (!!func) {
      func();
    }
  };

  private _getOpacity = (selectedArea: string) => {
    let shouldHighlight = true;
    if (this.state.isLegendHovered || this.state.isLegendSelected) {
      shouldHighlight = this.state.activeLegend === selectedArea;
    }
    return shouldHighlight ? '1' : '0.1';
  };

  private _getOpacityOfCircle = (selectedArea: string) => {
    let shouldHighlight = true;
    if (this.state.isLegendHovered || this.state.isLegendSelected) {
      shouldHighlight = this.state.activeLegend === selectedArea;
    }
    this._isGraphDraw = true;
    return shouldHighlight ? 'visibility' : 'hidden';
  };

  private _drawGraph = (containerHeight: number, containerWidth: number): void => {
    d3Select(`#firstGElementForChart123_${this._uniqueIdForGraph}`).remove();
    const { showYAxisGridLines, yAxisTickCount, yAxisTickFormat } = this.props;
    const that = this;
    const xScale = this._xAxisScale;
    const chartContainer = d3Select(`#graphGElement_${this._uniqueIdForGraph}`)
      .append('g')
      .attr('id', `firstGElementForChart123_${this._uniqueIdForGraph}`);

    this._colors = this._getColors();
    const stackedValues = d3Stack().keys(this._keys)(this.dataSet);

    // tslint:disable-next-line:no-any
    const stackedData: any[] = [];
    // tslint:disable-next-line:no-any
    stackedValues.forEach((layer: any) => {
      const currentStack: IAreaChartDataSetPoint[] = [];
      // tslint:disable-next-line: no-any
      layer.forEach((d: any) => {
        currentStack.push({
          values: d,
          xVal: d.data.xVal,
        });
      });
      stackedData.push(currentStack);
    });
    const maxOfYVal = d3Max(stackedValues[stackedValues.length - 1], dp => dp[1])!;
    const yAxisParams = {
      margins: this.margins,
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      yAxisElement: this.yAxisElement,
      yAxisTickFormat: yAxisTickFormat!,
      yAxisTickCount: yAxisTickCount ? yAxisTickCount : 4,
      finalYMaxVal: maxOfYVal,
      finalYMinVal: 0,
      tickPadding: 10,
      showYAxisGridLines: showYAxisGridLines!,
      data: this._points,
    };
    createYAxis(yAxisParams);

    // const xScale = d3ScaleLinear()
    //   .range([this.margins.left, this.state.containerWidth - this.margins.right])
    //   .domain([xMin, xMax]);

    // this._points[0].data[0].x instanceof Date ? xScale : xScale.nice();
    const yScale = d3ScaleLinear()
      .range([containerHeight - this.margins.bottom, this.margins.top])
      .domain([0, maxOfYVal]);

    const area = d3Area()
      // tslint:disable-next-line:no-any
      .x((d: any) => xScale(d.xVal))
      // tslint:disable-next-line:no-any
      .y0((d: any) => yScale(d.values[0]))
      // tslint:disable-next-line:no-any
      .y1((d: any) => yScale(d.values[1]))
      .curve(d3CurveBasis);

    const series = chartContainer
      .selectAll('.series')
      .data(stackedData)
      .enter();

    series
      .append('path')
      .style('fill', (d: string, i: number) => this._colors[i])
      .attr('stroke-width', 3)
      .attr('d', area)
      .attr('fill-opacity', (d: IDPointType, index: number) => {
        return that._getOpacity(this._points[index].legend);
      });

    const points = chartContainer
      .selectAll('.dots')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('class', 'dots')
      .attr('d', area)
      .attr('clip-path', 'url(#clip)');

    points
      .selectAll('.dot')
      .data((point: [], index: number) => {
        // tslint:disable-next-line:no-any
        const formatedArr: any = [];
        point.map((subPoint: IDPointType) => {
          formatedArr.push({ point: subPoint, index: index });
        });
        return formatedArr;
      })
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr(
        'id',
        (d: IDPointType, index: number) => `dot${d.index * stackedData[0].length + index}_${this._uniqueIdForGraph}`,
      )
      .attr('focusable', true)
      // .attr(
      //   'aria-labelledby',
      //   (d: IDPointType, index: number) => `${d.index * stackedData[0].length + index}_${this._uniqueIdForGraph}`,
      // )
      .attr('data-is-focusable', true)
      .attr('cx', (d: IDPointType) => xScale(d.point.xVal))
      .attr('cy', (d: IDPointType) => yScale(d.point.values[1]))
      .attr('r', 0.01)
      .attr('stroke', (d: IDPointType, index: number) => this._points[d.index].color)
      .attr('stroke-width', 3)
      .attr('visibility', (d: IDPointType, index: number) => {
        return that._getOpacityOfCircle(this._points[d.index].legend);
      })
      .attr('fill', (d: IDPointType, index: number) => this._points[d.index].color)
      .on('mouseover', (d: IDPointType, index: number) => {
        return that.handleMouseAction(
          xScale(d.point.xVal),
          d.point.xVal,
          `${d.index * stackedData[0].length + index}_${this._uniqueIdForGraph}`,
          this._points[d.index].data[index].xAxisCalloutData!,
        );
      })
      .on('mouseout', (d: IDPointType, index: number) =>
        that.mouseOutAction(
          `${d.index * stackedData[0].length + index}_${this._uniqueIdForGraph}`,
          this._points[d.index].color,
        ),
      )
      .on('focus', (d: IDPointType, index: number) => {
        const refArrayIndex = `${d.index * stackedData[0].length + index}_${this._uniqueIdForGraph}`;
        return that.handleFocusAction(
          xScale(d.point.xVal),
          d.point.xVal,
          this._points[d.index].legend,
          refArrayIndex,
          this._points[d.index].data[index].xAxisCalloutData!,
        );
      })
      .on('blur', (d: IDPointType, index: number) =>
        that.mouseOutAction(
          `${d.index * stackedData[0].length + index}_${this._uniqueIdForGraph}`,
          this._points[d.index].color,
        ),
      )
      .on('click', (d: IDPointType, index: number) =>
        that.onDataPointClick(
          this._points[d.index].data[index].onDataPointClick!,
          `${d.index * stackedData[0].length + index}_${this._uniqueIdForGraph}`,
          this._points[d.index].color,
        ),
      );

    chartContainer
      .append('line')
      .attr('class', 'verticalLine')
      .attr('id', this._verticalLineId)
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', containerHeight)
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1)
      .attr('visibility', 'hidden')
      .attr('stroke-dasharray', '5,5');
  };
}

// <div
//   id="d3AreaChart"
//   className={this._classNames.root}
//   role={'presentation'}
//   ref={(rootElem: HTMLDivElement) => (this.chartContainer = rootElem)}
// >
//   <FocusZone direction={FocusZoneDirection.horizontal}>
//     <svg width={svgDimensions.width} height={svgDimensions.height}>
//       <g
//         ref={(e: SVGElement | null) => {
//           this.xAxisElement = e;
//         }}
//         id="xAxisGElement"
//         transform={`translate(0, ${svgDimensions.height - 35})`}
//         className={this._classNames.xAxis}
//       />
//       <g
//         ref={(e: SVGElement | null) => {
//           this.yAxisElement = e;
//         }}
//         id="yAxisGElement"
//         transform={`translate(40, 0)`}
//         className={this._classNames.yAxis}
//       />
//       <g id={`graphGElement_${this._uniqueIdForGraph}`} />
//     </svg>
//   </FocusZone>
//   <div ref={(e: HTMLDivElement) => (this.legendContainer = e)} className={this._classNames.legendContainer}>
//     {legends}
//   </div>
//   {!this.props.hideTooltip && this.state.isCalloutVisible ? (
//     <Callout
//       id={this._callOutId}
//       target={this.state.refSelected}
//       gapSpace={15}
//       isBeakVisible={false}
//       setInitialFocus={true}
//       directionalHint={DirectionalHint.topRightEdge}
//     >
//       <div className={this._classNames.calloutContentRoot}>
//         <div className={this._classNames.calloutDateTimeContainer}>
//           <div className={this._classNames.calloutContentX}>{this.state.hoverXValue} </div>
//         </div>
//         <div className={this._classNames.calloutInfoContainer}>
//           {this.state.YValueHover &&
//             this.state.YValueHover.map(
//               (
//                 xValue: {
//                   legend?: string;
//                   y?: number;
//                   color?: string;
//                   yAxisCalloutData?: string;
//                 },
//                 index: number,
//               ) => (
//                 <div
//                   className={mergeStyles(this._classNames.calloutBlockContainer, {
//                     borderLeft: `4px solid ${xValue.color}`,
//                   })}
//                 >
//                   <div className={this._classNames.calloutlegendText}> {xValue.legend}</div>
//                   <div className={this._classNames.calloutContentY}>
//                     {xValue.yAxisCalloutData ? xValue.yAxisCalloutData : xValue.y}
//                   </div>
//                 </div>
//               ),
//             )}
//         </div>
//       </div>
//     </Callout>
//   ) : null}
// </div>
