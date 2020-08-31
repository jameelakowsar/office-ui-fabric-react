import { IEventsAnnotationProps } from '../components/LineChart/index';
import { ILineChartPoints, ILineChartDataPoint } from '../types/index';
import { axisRight as d3AxisRight, axisBottom as d3AxisBottom, axisLeft as d3AxisLeft, Axis as D3Axis } from 'd3-axis';
import { max as d3Max, min as d3Min } from 'd3-array';
import { scaleLinear as d3ScaleLinear, scaleTime as d3ScaleTime } from 'd3-scale';
import { select as d3Select, event as d3Event } from 'd3-selection';
import { format as d3Format } from 'd3-format';
import * as d3TimeFormat from 'd3-time-format';

type NumericAxis = D3Axis<number | { valueOf(): number }>;
type StringAxis = D3Axis<string>;

export enum ChartTypes {
  AreaChart = 1,
  LineChart = 2,
  VerticalBarChart = 3,
  VerticalStackedBarChart = 4,
  GroupedVerticalBarChart = 5,
}

export interface IWrapLabelProps {
  node: SVGGElement | null;
  xAxis: NumericAxis | StringAxis;
  noOfCharsToTruncate: number;
  showXAxisLablesTooltip: boolean;
}

export interface IMargins {
  /**
   * left margin for the chart.
   */
  left?: number;
  /**
   * Right margin for the chart.
   */
  right?: number;
  /**
   * Top margin for the chart.
   */
  top?: number;
  /**
   * Bottom margin for the chart.
   */
  bottom?: number;
}

export interface IXAxisParams {
  margins: IMargins;
  containerWidth: number;
  xMinMaxValues: {
    xMin: number | Date;
    xMax: number | Date;
  };
  xAxisElement?: SVGElement | null;
  xAxisCount?: number;
  showRoundOffXTickValues?: boolean;
  tickSize?: number;
  tickPadding?: number;
}
export interface ITickParams {
  tickValues?: Date[] | number[];
  tickFormat?: string;
}

export interface IYAxisParams {
  yMinMaxValues: {
    yMin: number;
    yMax: number;
  };
  maxOfYVal?: number;
  margins: IMargins;
  containerWidth: number;
  containerHeight: number;
  yAxisElement?: SVGElement | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yAxisTickFormat?: any;
  yAxisTickCount: number;
  yMaxValue?: number;
  yMinValue?: number;
  tickPadding?: number;
  eventAnnotationProps?: IEventsAnnotationProps;
  eventLabelHeight?: number;
}

export interface IContainerValues {
  width: number;
  height: number;
  shouldResize: boolean;
  reqID: number;
}

export interface IFitContainerParams {
  containerWidth: number;
  containerHeight: number;
  hideLegend: boolean;
  legendContainer: HTMLDivElement;
  container: HTMLDivElement | null | HTMLElement;
}

export const additionalMarginRight: number = 20;

/**
 * Create Numeric X axis
 * @export
 * @param {IXAxisParams} xAxisParams
 * @param {boolean} isRtl
 */
export function createNumericXAxis(xAxisParams: IXAxisParams, isRtl: boolean) {
  const {
    xMinMaxValues,
    margins,
    containerWidth,
    showRoundOffXTickValues = false,
    tickSize = 10,
    tickPadding = 10,
    xAxisCount = 10,
    xAxisElement,
  } = xAxisParams;
  const xAxisScale = d3ScaleLinear()
    .domain(isRtl ? [xMinMaxValues.xMax, xMinMaxValues.xMin] : [xMinMaxValues.xMin, xMinMaxValues.xMax])
    .range([margins.left!, containerWidth - margins.right! - (isRtl ? additionalMarginRight : 0)]);
  showRoundOffXTickValues && xAxisScale.nice();

  const xAxis = d3AxisBottom(xAxisScale)
    .tickSize(tickSize)
    .tickPadding(tickPadding)
    .ticks(xAxisCount)
    .tickSizeOuter(0);
  if (xAxisElement) {
    d3Select(xAxisElement)
      .call(xAxis)
      .selectAll('text');
  }
  return xAxisScale;
}

/**
 * Creating Date x axis of the Chart
 * @export
 * @param {IXAxisParams} xAxisParams
 * @param {ITickParams} tickParams
 * @param {boolean} isRtl
 */
export function createDateXAxis(xAxisParams: IXAxisParams, tickParams: ITickParams, isRtl: boolean) {
  const { xMinMaxValues, margins, containerWidth, xAxisElement } = xAxisParams;
  const xAxisScale = d3ScaleTime()
    .domain(isRtl ? [xMinMaxValues.xMax, xMinMaxValues.xMin] : [xMinMaxValues.xMin, xMinMaxValues.xMax])
    .range([margins.left!, containerWidth - margins.right! - (isRtl ? additionalMarginRight : 0)]);
  const xAxis = d3AxisBottom(xAxisScale)
    .tickSize(10)
    .tickPadding(10);
  tickParams.tickValues ? xAxis.tickValues(tickParams.tickValues) : '';
  tickParams.tickFormat ? xAxis.tickFormat(d3TimeFormat.timeFormat(tickParams.tickFormat)) : '';
  if (xAxisElement) {
    d3Select(xAxisElement)
      .call(xAxis)
      .selectAll('text');
  }
  return xAxisScale;
}

export function prepareDatapoints(maxVal: number, minVal: number, splitInto: number): number[] {
  const val = Math.ceil((maxVal - minVal) / splitInto);
  const dataPointsArray: number[] = [minVal, minVal + val];
  while (dataPointsArray[dataPointsArray.length - 1] < maxVal) {
    dataPointsArray.push(dataPointsArray[dataPointsArray.length - 1] + val);
  }
  return dataPointsArray;
}

/**
 * Creating Y axis of the chart
 * @export
 * @param {IYAxisParams} yAxisParams
 * @param {boolean} isRtl
 */
export function createYAxis(yAxisParams: IYAxisParams, isRtl: boolean) {
  const {
    yMinMaxValues,
    yAxisElement = null,
    yMaxValue = 0,
    yMinValue = 0,
    containerHeight,
    containerWidth,
    margins,
    tickPadding = 12,
    maxOfYVal = 0,
    yAxisTickFormat,
    yAxisTickCount = 4,
    eventAnnotationProps,
    eventLabelHeight,
  } = yAxisParams;

  // maxOFYVal coming from only area chart (If shoule calculate from processed data)
  const tempVal = maxOfYVal || yMinMaxValues.yMax;
  const finalYmax = tempVal > yMaxValue ? tempVal : yMaxValue!;
  const finalYmin = yMinMaxValues.yMin < yMinValue ? 0 : yMinValue!;
  const domainValues = prepareDatapoints(finalYmax, finalYmin, yAxisTickCount);
  const yAxisScale = d3ScaleLinear()
    .domain([finalYmin, domainValues[domainValues.length - 1]])
    .range([containerHeight - margins.bottom!, margins.top! + (eventAnnotationProps! ? eventLabelHeight! : 0)]);
  const axis = isRtl ? d3AxisRight(yAxisScale) : d3AxisLeft(yAxisScale);
  const yAxis = axis
    .tickPadding(tickPadding)
    .tickValues(domainValues)
    .tickSizeInner(-(containerWidth - margins.left! - margins.right!));
  yAxisTickFormat ? yAxis.tickFormat(yAxisTickFormat) : yAxis.tickFormat(d3Format('.2s'));
  yAxisElement
    ? d3Select(yAxisElement)
        .call(yAxis)
        .selectAll('text')
    : '';
  return yAxisScale;
}

export function calloutData(values: ILineChartPoints[]) {
  let combinedResult: {
    legend: string;
    y: number;
    x: number | Date | string;
    color: string;
    yAxisCalloutData?: string | { [id: string]: number };
  }[] = [];

  values.forEach((element: { data: ILineChartDataPoint[]; legend: string; color: string }) => {
    const elements = element.data.map((ele: ILineChartDataPoint) => {
      return { legend: element.legend, ...ele, color: element.color };
    });
    combinedResult = combinedResult.concat(elements);
  });

  const result: { x: number | Date | string; values: { legend: string; y: number }[] }[] = [];
  combinedResult.forEach(
    (
      e1: { legend: string; y: number; x: number | Date | string; color: string; yAxisCalloutData: string },
      index: number,
    ) => {
      e1.x = e1.x instanceof Date ? e1.x.getTime() : e1.x;
      const filteredValues = [{ legend: e1.legend, y: e1.y, color: e1.color, yAxisCalloutData: e1.yAxisCalloutData }];
      combinedResult
        .slice(index + 1)
        .forEach(
          (e2: { legend: string; y: number; x: number | Date | string; color: string; yAxisCalloutData: string }) => {
            e2.x = e2.x instanceof Date ? e2.x.getTime() : e2.x;
            if (e1.x === e2.x) {
              filteredValues.push({
                legend: e2.legend,
                y: e2.y,
                color: e2.color,
                yAxisCalloutData: e2.yAxisCalloutData,
              });
            }
          },
        );
      result.push({ x: e1.x, values: filteredValues });
    },
  );
  return getUnique(result, 'x');
}

export function getUnique(
  arr: { x: number | Date | string; values: { legend: string; y: number }[] }[],
  comp: string | number,
) {
  const unique = arr
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((e: { [x: string]: any }) => e[comp])
    // store the keys of the unique objects
    .map((e: string, i: number, final: string[]) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter((e: number) => arr[e])
    .map((e: number) => arr[e]);
  return unique;
}

/**
 * This function takes two paramerter
 * 1. an array of strings
 * 2. a string value
 * if the value is not present in the given array then it will return the new
 * array by appending the value to the present arrray.
 *
 * if the value is already present in  the given array then it will return the new
 * array by deleteing the value from the the array
 * @param array
 * @param value
 */
export function silceOrAppendToArray(array: string[], value: string): string[] {
  const pos = array.indexOf(value);
  if (pos === -1) {
    return [...array, value];
  } else {
    return array.slice(0, pos).concat(array.slice(pos + 1));
  }
}

export function createWrapOfXLabels(wrapLabelProps: IWrapLabelProps) {
  const { node, xAxis, noOfCharsToTruncate, showXAxisLablesTooltip } = wrapLabelProps;
  if (node === null) {
    return;
  }
  const axisNode = d3Select(node).call(xAxis);
  let removeVal = 0;
  const width = 10;
  const arr: number[] = [];
  axisNode.selectAll('.tick text').each(function() {
    const text = d3Select(this);
    const totalWord = text.text();
    const truncatedWord = `${text.text().slice(0, noOfCharsToTruncate)}...`;
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

    if (showXAxisLablesTooltip && totalWordLength > noOfCharsToTruncate) {
      tspan = text
        .append('tspan')
        .attr('id', 'showDots')
        .attr('x', 0)
        .attr('y', y)
        .attr('dy', ++lineNumber * lineHeight + dy + 'em')
        .text(truncatedWord);
    } else if (showXAxisLablesTooltip && totalWordLength <= noOfCharsToTruncate) {
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
      let maxHeight: number = 12; // intial value to render corretly first time
      axisNode.selectAll('text').each(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const outerHTMLElement = document.getElementById('WordBreakId') as any;
        const BoxCordinates = outerHTMLElement && outerHTMLElement.getBoundingClientRect();
        const boxHeight = BoxCordinates && BoxCordinates.height;
        if (boxHeight > maxHeight) {
          maxHeight = boxHeight;
        }
      });
      removeVal = (maxDigit - 3) * maxHeight; // we are getting more height if take direclty
    }
  });
  return removeVal > 0 ? removeVal : 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function tooltipOfXAxislabels(xAxistooltipProps: any) {
  const { tooltipCls, xAxis, id } = xAxistooltipProps;
  const div = d3Select('body')
    .append('div')
    .attr('id', id)
    .attr('class', tooltipCls)
    .style('opacity', 0);
  const tickObject = xAxis!.selectAll('.tick')._groups[0];
  const tickObjectLength = Object.keys(tickObject).length;
  for (let i = 0; i < tickObjectLength; i++) {
    const d1 = tickObject[i];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = d3Select(d1).data();
    d3Select(d1)
      .on('mouseover', d => {
        div.style('opacity', 0.9);
        div
          .html(data)
          .style('left', d3Event.pageX + 'px')
          .style('top', d3Event.pageY - 28 + 'px');
      })
      .on('mouseout', d => {
        div.style('opacity', 0);
      });
  }
}

export function findDateMinMaxOfX(points: ILineChartPoints[]): { xMin: number | Date; xMax: number | Date } {
  let sDate = new Date();
  // selecting least date and comparing it with data passed to get farthest Date for the range on X-axis
  let lDate = new Date(-8640000000000000);
  const xAxisData: Date[] = [];
  points.forEach((singleLineChartData: ILineChartPoints) => {
    singleLineChartData.data.forEach((point: ILineChartDataPoint) => {
      xAxisData.push(point.x as Date);
      if (point.x < sDate) {
        sDate = point.x as Date;
      }
      if (point.x > lDate) {
        lDate = point.x as Date;
      }
    });
  });

  return {
    xMin: sDate,
    xMax: lDate,
  };
}

export function findNumericMinMaxOfX(points: ILineChartPoints[]): { xMin: number; xMax: number } {
  const xMin = d3Min(points, (point: ILineChartPoints) => {
    return d3Min(point.data, (item: ILineChartDataPoint) => item.x as number)!;
  })!;

  const xMax = d3Max(points, (point: ILineChartPoints) => {
    return d3Max(point.data, (item: ILineChartDataPoint) => {
      return item.x as number;
    });
  })!;

  return {
    xMin,
    xMax,
  };
}

/**
 * To find x axis domian min and max values
 * @export
 * @param {ILineChartPoints[]} points
 * @param {ChartTypes} chartType
 * @param {boolean} isXAxisDateType
 * @returns {({ xMin: number | Date; xMax: number | Date })}
 */
export function getMinMaxOfXAxis(
  points: ILineChartPoints[],
  chartType: ChartTypes,
  isXAxisDateType: boolean,
): { xMin: number | Date; xMax: number | Date } {
  let minMaxValues: { xMin: number | Date; xMax: number | Date };

  if (isXAxisDateType) {
    switch (chartType) {
      case ChartTypes.AreaChart:
      case ChartTypes.LineChart:
        minMaxValues = findDateMinMaxOfX(points);
        break;
      default:
        minMaxValues = { xMin: 0, xMax: 0 };
    }
  } else {
    switch (chartType) {
      case ChartTypes.AreaChart:
      case ChartTypes.LineChart:
        minMaxValues = findNumericMinMaxOfX(points);
        break;
      default:
        minMaxValues = { xMin: 0, xMax: 0 };
    }
  }

  return minMaxValues;
}

export function findNumericMinMaxOfY(points: ILineChartPoints[]): { yMin: number; yMax: number } {
  const yMax = d3Max(points, (point: ILineChartPoints) => {
    return d3Max(point.data, (item: ILineChartDataPoint) => item.y)!;
  })!;
  const yMin = d3Min(points, (point: ILineChartPoints) => {
    return d3Min(point.data, (item: ILineChartDataPoint) => item.y)!;
  })!;

  return {
    yMin,
    yMax,
  };
}

/**
 * finding Y axis domain min and max values
 *
 * @export
 * @param {ILineChartPoints[]} points
 * @param {ChartTypes} chartType
 * @returns {{ yMin: number; yMax: number }}
 */
export function getMinMaxOfYAxis(points: ILineChartPoints[], chartType: ChartTypes): { yMin: number; yMax: number } {
  let minMaxValues: { yMin: number; yMax: number };

  switch (chartType) {
    case ChartTypes.AreaChart:
    case ChartTypes.LineChart:
      minMaxValues = findNumericMinMaxOfY(points);
      break;
    default:
      minMaxValues = { yMin: 0, yMax: 0 };
  }

  return minMaxValues;
}

export function getXAxisType(points: ILineChartPoints[]): boolean {
  let isXAxisDateType: boolean = false;
  if (points && points.length > 0) {
    points.forEach((chartData: ILineChartPoints) => {
      if (chartData.data.length > 0) {
        isXAxisDateType = chartData.data[0].x instanceof Date;
        return;
      }
    });
  }
  return isXAxisDateType;
}
