import * as React from 'react';
import { max as d3Max } from 'd3-array';
import { axisLeft as d3AxisLeft, axisBottom as d3AxisBottom, Axis as D3Axis } from 'd3-axis';
import { scaleBand as d3ScaleBand, scaleLinear as d3ScaleLinear } from 'd3-scale';
import { select as d3Select } from 'd3-selection';
import { TooltipHost, ITooltipHostStyles } from 'office-ui-fabric-react/lib/Tooltip';
import { classNamesFunction, getId } from 'office-ui-fabric-react/lib/Utilities';
import { IProcessedStyleSet, IPalette } from 'office-ui-fabric-react/lib/Styling';
import { Callout, DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { ILegend, Legends } from '../Legends/index';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import {
  IGroupedVerticalBarChartProps,
  IGroupedVerticalBarChartStyleProps,
  IGroupedVerticalBarChartStyles,
} from './GroupedVerticalBarChart.types';
import {
  IGroupedVerticalBarChartData,
  IGVDataPoint,
  IGVSingleDataPoint,
  IGVBarChartSeriesPoint,
  IBasestate,
  IRefArrayData,
} from '../../types/index';
import { ChartHoverCard } from '../../utilities/ChartHoverCard/index';

const getClassNames = classNamesFunction<IGroupedVerticalBarChartStyleProps, IGroupedVerticalBarChartStyles>();
type StringAxis = D3Axis<string>;
type NumericAxis = D3Axis<number | { valueOf(): number }>;

export interface IGroupedVerticalBarChartState extends IBasestate {
  titleForHoverCard: string;
  isShowLabelTooltip: boolean;
}
export class GroupedVerticalBarChartBase extends React.Component<
  IGroupedVerticalBarChartProps,
  IGroupedVerticalBarChartState
> {
  private _points: IGroupedVerticalBarChartData[];
  private _yAxisTickCount: number;
  private _xAxisLabels: string[];
  private _barWidth: number;
  private _groupPadding: number = 16;
  private _showYAxisGridLines: boolean;
  private _classNames: IProcessedStyleSet<IGroupedVerticalBarChartStyles>;
  private _refArray: IRefArrayData[];
  private yAxisElement: SVGElement | null;
  private _reqID: number;
  private _calloutId: string;
  private _yMax: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _datasetForBars: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _xScale0: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _xScale1: any;
  private _uniqLineText: string;
  private _dataset: IGVDataPoint[];
  private _removalValue: number = 0;
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
      titleForHoverCard: '',
      xCalloutValue: '',
      yCalloutValue: '',
      _width: this.props.width || 600,
      _height: this.props.height || 350,
      isShowLabelTooltip: false,
    };
    this._refArray = [];
    this._calloutId = getId('callout');
    this._adjustProps();
    this._uniqLineText = getId('GroupedVerticalChart_');
  }

  public componentDidMount(): void {
    this._fitParentContainer(true);
  }

  public componentWillUnmount(): void {
    cancelAnimationFrame(this._reqID);
  }

  public componentDidUpdate(prevProps: IGroupedVerticalBarChartProps): void {
    if (
      prevProps.height !== this.props.height ||
      prevProps.width !== this.props.width ||
      prevProps.data !== this.props.data
    ) {
      this._fitParentContainer();
    }
  }

  public render(): React.ReactNode {
    this._adjustProps();
    const { theme, className, styles } = this.props;

    if (this.props.parentRef) {
      this._fitParentContainer();
    }

    this._xAxisLabels = this._createXAxisProperties();
    this._datasetForBars = this._createDataset();
    this._xScale0 = this._createX0Scale(this._xAxisLabels);
    this._xScale1 = this._createX1Scale(this._xScale0);
    const x0Axis = this._createx0Axis(this._xScale0);
    this._createYAxis(this._dataset);
    const legends: JSX.Element = this._getLegendData(this.props.theme!.palette);
    const graph = this._getGraphBars();
    const ticks = this._xAxisLabels.map((label: any) => ({
      label,
      xOffset: this._xScale0(label),
    }));
    // console.log(ticks, 'ticks');

    this._classNames = getClassNames(styles!, {
      theme: theme!,
      className,
      legendColor: this.state.color,
      href: this.props.href,
      width: this.state._width,
      height: this.state._height,
    });

    const svgDimensions = {
      width: this.state.containerWidth || 600,
      height: this.state.containerHeight || 350,
    };

    const calloutProps = { gapSpace: 0 };
    const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };

    return (
      <div
        id={`d3GroupedChart_${this._uniqLineText}`}
        ref={(rootElem: HTMLDivElement) => (this.chartContainer = rootElem)}
        className={this._classNames.root}
      >
        <FocusZone direction={FocusZoneDirection.horizontal}>
          <svg width={svgDimensions.width} height={svgDimensions.height} id={this._uniqLineText}>
            <g
              id="xAxisGElement"
              // ref={(node: SVGGElement | null) => this._setXAxis(node, x0Axis)}
              className={this._classNames.xAxis}
              transform={`translate(0, ${svgDimensions.height - 35})`}
            >
              {ticks.map((singleTick: any) => {
                const aa = (
                  <text key={singleTick.label} fill="#000" y={10} dy={`0.71em`} onMouseOver={this._onTextOver}>
                    {singleTick.label}
                  </text>
                );
                return (
                  <g key={singleTick.label} transform={`translate(${this._xScale0(singleTick.label)}, 0)`}>
                    <line y2={6} stroke="#000" />
                    {/* <TooltipHost
                      content="Correct positioning"
                      styles={hostStyles}
                      id={'tooltip2Id'}
                      calloutProps={calloutProps}
                    > */}
                    {aa}
                    {/* </TooltipHost> */}
                  </g>
                );
              })}
            </g>
            <g
              id="yAxisGElement"
              ref={(e: SVGElement | null) => {
                this.yAxisElement = e;
              }}
              // ref={(node: SVGGElement | null) => this._setYAxis(node, yAxis)}
              className={this._classNames.yAxis}
              transform={`translate(40, 0)`}
            />
            <g id={`barGElement_${this._uniqLineText}`} className="barGElement">
              {graph}
            </g>
          </svg>
        </FocusZone>
        <div
          ref={(e: HTMLDivElement) => (this.legendContainer = e)}
          id={this._uniqLineText}
          className={this._classNames.legendContainer}
        >
          {legends}
        </div>
        <Callout
          target={this.state.refSelected}
          gapSpace={10}
          isBeakVisible={false} // for traingle // text id // hover
          setInitialFocus={true}
          hidden={!(!this.props.hideTooltip && this.state.isCalloutVisible)}
          directionalHint={DirectionalHint.topRightEdge}
          id={this._calloutId}
        >
          <ChartHoverCard
            XValue={this.state.xCalloutValue}
            Legend={this.state.titleForHoverCard}
            YValue={this.state.yCalloutValue ? this.state.yCalloutValue : this.state.dataForHoverCard}
            color={this.state.color}
          />
        </Callout>
        {/* <Callout
          // target={this.state.refSelected}
          gapSpace={10}
          isBeakVisible={true} // text id // hover
          setInitialFocus={true}
          hidden={!(!this.props.showXAxisLablesTooltip && this.state.isShowLabelTooltip)}
          directionalHint={DirectionalHint.topRightEdge}
          id={this._calloutId}
        >
          {aa}
        </Callout> */}
      </div>
    );
  }

  private _onTextOver = () => {
    console.log('hell');
  };

  private _adjustProps(): void {
    this._points = this.props.data || [];
    this._yAxisTickCount = this.props.yAxisTickCount || 5;
    this._showYAxisGridLines = this.props.showYAxisGridLines || false;
    this._barWidth = this.props.barwidth!;
  }

  private _fitParentContainer(calledFromDidMount?: boolean): void {
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
        this.setState(
          {
            containerWidth: currentContainerWidth,
            containerHeight: currentContainerHeight - legendContainerHeight,
          },
          () => {
            if (calledFromDidMount) {
              // this._drawGraph();
            }
          },
        );
      }
    });
  }

  private _getOpacity = (legendTitle: string) => {
    let shouldHighlight = true;
    if (this.state.isLegendHovered || this.state.isLegendSelected) {
      shouldHighlight = this.state.titleForHoverCard === legendTitle;
    }
    return shouldHighlight ? '' : '0.1';
  };

  private _getGraphBars = () => {
    const allGroups: JSX.Element[] = [];
    this._datasetForBars.forEach((singleSet: IGVSingleDataPoint, index: number) => {
      const singleGroup = this._graph(singleSet);
      allGroups.push(singleGroup);
    });
    return allGroups;
  };

  private _onBarHover = (pointData: IGVBarChartSeriesPoint, mouseEvent: React.MouseEvent<SVGPathElement>) => {
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
  private _graph = (singleSet: any) => {
    const singleGroup: JSX.Element[] = [];
    const yBarScale = d3ScaleLinear()
      .domain([0, this._yMax])
      .range([0, this.state.containerHeight! - this._removalValue - this.margins.bottom - this.margins.top]);
    let widthOfBar: number;
    if (this._barWidth && this._barWidth < this._xScale1.bandwidth()) {
      widthOfBar = this._barWidth;
    } else {
      widthOfBar = this._xScale1.bandwidth();
    }
    const tempDataSet = Object.keys(this._datasetForBars[0]).splice(0, this._keys.length);
    tempDataSet.forEach((datasetKey: string, index: number) => {
      const refIndexNumber = singleSet.indexNum * tempDataSet.length + index;
      const pointData = singleSet[datasetKey];
      singleGroup.push(
        <rect
          // className={this._classNames.opacityChangeOnHover}
          key={`${singleSet.indexNum}-${index}`}
          height={yBarScale(pointData.data) > 0 ? yBarScale(pointData.data) : 0}
          width={widthOfBar}
          x={this._xScale1(datasetKey)!}
          y={this.state.containerHeight! - this._removalValue - this.margins.bottom - yBarScale(pointData.data)}
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
    return (
      <g key={singleSet.indexNum} transform={`translate(${this._xScale0(singleSet.xAxisPoint)}, 0)`}>
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

  private _createX0Scale = (xAxisLabels: string[]) => {
    const x0Axis = d3ScaleBand()
      .domain(xAxisLabels.map((label: string) => label))
      .range([this.margins.left, this.state.containerWidth! - this.margins.right])
      .padding(this._groupPadding / 100);
    return x0Axis;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _createX1Scale = (xScale0: any): any => {
    return d3ScaleBand()
      .domain(this._keys)
      .range([0, xScale0.bandwidth()])
      .padding(0.05);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _createx0Axis = (xScale0: any): any => {
    const x0Axis = d3AxisBottom(xScale0).tickPadding(4);
    return x0Axis;
  };

  private _createYAxis(dataset: IGVDataPoint[]): NumericAxis {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yMax: number = d3Max(dataset, (point: any) => d3Max(this._keys, (key: string) => point[key]));
    this._yMax = yMax;
    const interval = Math.ceil(yMax / this._yAxisTickCount);
    const domains: Array<number> = [0];
    while (domains[domains.length - 1] < yMax) {
      domains.push(domains[domains.length - 1] + interval);
    }
    const yAxisScale = d3ScaleLinear()
      .domain([0, domains[domains.length - 1]])
      .range([this.state.containerHeight! - this.margins.bottom, this.margins.top]);
    const yAxis = d3AxisLeft(yAxisScale)
      .tickPadding(5)
      .ticks(this._yAxisTickCount, 's')
      .tickValues(domains);

    this._showYAxisGridLines &&
      yAxis.tickSizeInner(-(this.state.containerWidth! - this.margins.left - this.margins.right));

    this.yAxisElement
      ? d3Select(this.yAxisElement)
          .call(yAxis)
          .selectAll('text')
      : '';

    return yAxis;
  }

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
      />
    );
  };

  private _createWrapOfXLabels(node: SVGGElement | null, xAxis: any): any {
    const that = this;
    if (node === null) {
      return;
    }
    const axisNode = d3Select(node).call(xAxis);

    const totalTexts = axisNode.selectAll('.tick text').call(_wrap, 10);
    // const tCounts = totalTexts._groups[0];
    // const wrapperDiv = document.createElement('div');
    // const tooltipVals: any[] = [];
    // const modifiedTexts = tCounts.forEach((singleText: any) => {
    // const selectedText = singleText;
    // tooltipVals.push(<TooltipHost content={'Hip hip hurray'}>{singleText}</TooltipHost>);
    // });
    // console.log(tooltipVals[0], 'tooltipvalsss');

    let removeVal = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _wrap(allTexts: any, width: number) {
      const arr: number[] = [];
      allTexts.each(function() {
        const text = d3Select(this);
        const totalWord = text.text();
        const truncatedWord = `${text.text().slice(0, 4)}...`;
        const totalWordLength = text.text().length;
        const words = text
          .text()
          .split(/\s+/)
          .reverse();
        arr.push(words.length);
        let word: string = '';
        let line: string[] = [];
        let lineNumber: number = 0;
        const lineHeight = 1.1; // ems
        const y = text.attr('y');
        const dy = parseFloat(text.attr('dy'));
        let tspan = text
          .text(null)
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('id', 'BaseSpan')
          .attr('dy', dy + 'em');

        if (that.props.showXAxisLablesTooltip && totalWordLength > 4) {
          // why tspan here?
          tspan = text
            .append('tspan')
            .attr('id', 'showDots')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(truncatedWord);
        } else if (that.props.showXAxisLablesTooltip && totalWordLength <= 4) {
          tspan = text
            .append('tspan')
            .attr('id', 'LessLength')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(totalWord);
        } else {
          while ((word = words.pop()!)) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node()!.getComputedTextLength() > width && line.length > 1) {
              line.pop();
              tspan.text(line.join(' '));
              line = [word];
              tspan = text
                .append('tspan')
                .attr('id', 'WordBreakId')
                .attr('x', 0)
                .attr('y', y)
                .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                .text(word);
            }
          }
          const maxDigit = Math.max(...arr);
          let maxHeight = 0;
          axisNode.selectAll('text').each(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const outerHTMLElement = document.getElementById('WordBreakId') as any;
            const BoxCordinates = outerHTMLElement ? outerHTMLElement.getBBox() : '';
            const boxHeight = BoxCordinates!.height || 12;
            if (boxHeight > maxHeight) {
              maxHeight = boxHeight;
            }
          });
          removeVal = (maxDigit - 3) * maxHeight;
          that._removalValue = removeVal > 0 ? removeVal : 0;
        }
      });
    }
  }

  private _setXAxis(node: SVGGElement | null, xAxis: NumericAxis | StringAxis): void {
    if (node === null) {
      return;
    }
    d3Select(node).call(xAxis);
    (this.props.wrapXAxisLables || this.props.showXAxisLablesTooltip) && this._createWrapOfXLabels(node, xAxis);
  }

  // private _setYAxis(node: SVGElement | null, yAxis: NumericAxis): void {
  //   if (node === null) {
  //     return;
  //   }
  //   d3Select(node).call(yAxis);
  // }
}

// how for wrapping words?
