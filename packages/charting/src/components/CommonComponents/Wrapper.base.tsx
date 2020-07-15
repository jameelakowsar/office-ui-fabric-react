import * as React from 'react';
import { IProcessedStyleSet, IPalette, mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { classNamesFunction, getId } from 'office-ui-fabric-react/lib/Utilities';
import { ILineChartProps, ILineChartStyleProps, ILineChartStyles, ILineChartState } from '../LineChart/index';
import {
  calloutData,
  createNumericXAxis,
  createDateXAxis,
  createYAxis,
  fitContainer,
  IMargins,
} from '../../utilities/index';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { IWrapperProps } from './ChartModule.types';

const getClassNames = classNamesFunction<ILineChartStyleProps, ILineChartStyles>();

export interface IContainerValues {
  width: number;
  height: number;
  shouldResize: boolean;
  reqID: number;
}

export interface IWrapperState {
  containerWidth: number;
  containerHeight: number;
  _width: number;
  _height: number;
}

export class WrapperBase extends React.Component<IWrapperProps, IWrapperState> {
  private _classNames: IProcessedStyleSet<ILineChartStyles>;
  private chartContainer: HTMLDivElement;
  private legendContainer: HTMLDivElement;
  private containerParams: IContainerValues;
  private xAxisElement: SVGElement | null;
  private yAxisElement: SVGElement | null;
  private margins: IMargins;

  constructor(props: IWrapperProps) {
    super(props);
    this.state = {
      containerHeight: 0,
      containerWidth: 0,
      _width: this.props.width || 600,
      _height: this.props.height || 350,
    };
    this.margins = {
      top: this.props.margins?.top || 20,
      right: this.props.margins?.right || 20,
      bottom: this.props.margins?.bottom || 35,
      left: this.props.margins?.left || 40,
    };
  }

  public componentDidMount(): void {
    this._fitParentContainer();
  }

  public componentWillUnmount(): void {
    cancelAnimationFrame(this.containerParams.reqID);
  }

  public componentDidUpdate(prevProps: IWrapperProps): void {
    if (prevProps.height !== this.props.height || prevProps.width !== this.props.width) {
      this._fitParentContainer();
    }
  }

  public render(): JSX.Element {
    const { theme, className, styles, domainXMin, domainXMax, data, maxOfYVal, tickValues, tickFormat } = this.props;
    const XAxisParams = {
      margins: this.margins,
      containerWidth: this.state.containerWidth,
      xAxisElement: this.xAxisElement!,
      domainXMin,
      domainXMax,
      showRoundOffXTickValues: true,
      points: data,
    };
    const tickParams = {
      tickValues: tickValues,
      tickFormat: tickFormat,
    };
    console.log(tickParams, 'in wrapper');
    const YAxisParams = {
      margins: this.margins,
      containerWidth: this.state.containerWidth,
      containerHeight: this.state.containerHeight,
      yAxisElement: this.yAxisElement,
      // yAxisTickFormat: yAxisTickFormat!,
      // yAxisTickCount: yAxisTickCount ? yAxisTickCount : 4,
      yAxisTickCount: 4,
      finalYMaxVal: maxOfYVal,
      finalYMinVal: 0,
      tickPadding: 10,
      // showYAxisGridLines: showYAxisGridLines!,
      showYAxisGridLines: true,
      points: data,
    };

    const getData = this.getData(XAxisParams, YAxisParams, tickParams);
    this._classNames = getClassNames(styles!, {
      theme: theme!,
      width: this.state._width,
      height: this.state._height,
      className,
    });
    const svgDimensions = {
      width: this.state.containerWidth,
      height: this.state.containerHeight,
    };
    return (
      <div
        id="d3AreaChart"
        className={this._classNames.root}
        role={'presentation'}
        ref={(rootElem: HTMLDivElement) => (this.chartContainer = rootElem)}
      >
        <FocusZone direction={FocusZoneDirection.horizontal}>
          <svg width={svgDimensions.width} height={svgDimensions.height}>
            <g
              ref={(e: SVGElement | null) => {
                this.xAxisElement = e;
              }}
              id="xAxisGElement"
              transform={`translate(0, ${svgDimensions.height - 35})`}
              className={this._classNames.xAxis}
            />
            <g
              ref={(e: SVGElement | null) => {
                this.yAxisElement = e;
              }}
              id="yAxisGElement"
              transform={`translate(40, 0)`}
              className={this._classNames.yAxis}
            />
            {/* {this.props.children} */}
            {this.props.render({
              ...this.state,
              x: createNumericXAxis(XAxisParams),
              y: createYAxis(YAxisParams),
            })}
          </svg>
        </FocusZone>
        <div ref={(e: HTMLDivElement) => (this.legendContainer = e)} className={this._classNames.legendContainer}>
          {/* {this.props.children} */}
        </div>
      </div>
    );
  }

  private _fitParentContainer(): void {
    const reqParams = {
      containerWidth: this.state.containerWidth,
      containerHeight: this.state.containerHeight,
      hideLegend: this.props.hideLegend!,
      legendContainer: this.legendContainer,
      container: this.props.parentRef ? this.props.parentRef : this.chartContainer,
    };
    this.containerParams = fitContainer(reqParams);
    if (this.containerParams.shouldResize) {
      this.setState({
        containerWidth: this.containerParams.width,
        containerHeight: this.containerParams.height,
      });
    }
  }

  private getData = (XAxisParams: any, YAxisParams: any, tickParams: any) => {
    this.props._getLinesData(createDateXAxis(XAxisParams, tickParams), createYAxis(YAxisParams));
  };
}
