import * as React from 'react';
import { IProcessedStyleSet, mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { IWrapperStyleProps, IWrapperProps, IWrapperStyles } from './Wrapper.types';

import {
  createNumericXAxis,
  createDateXAxis,
  createYAxis,
  fitContainer,
  IMargins,
  IXAxisParams,
  IYAxisParams,
} from '../../utilities/index';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';

const getClassNames = classNamesFunction<IWrapperStyleProps, IWrapperStyles>();
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
  private _classNames: IProcessedStyleSet<IWrapperStyles>;
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
    const { theme, className, styles, points, maxOfYVal, calloutProps, yAxisTickFormat } = this.props;
    if (this.props.parentRef) {
      this._fitParentContainer();
    }
    const XAxisParams = {
      margins: this.margins,
      containerWidth: this.state.containerWidth,
      xAxisElement: this.xAxisElement!,
      showRoundOffXTickValues: true,
      points: points,
    };

    const YAxisParams = {
      margins: this.margins,
      containerWidth: this.state.containerWidth,
      containerHeight: this.state.containerHeight,
      yAxisElement: this.yAxisElement,
      yAxisTickFormat: yAxisTickFormat!,
      yAxisTickCount: 4,
      finalYMaxVal: maxOfYVal,
      finalYMinVal: 0,
      tickPadding: 10,
      showYAxisGridLines: true,
      points,
    };

    this.getData(XAxisParams, YAxisParams);

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
    const children = this.props.children({
      ...this.state,
      xScale: this.props.isXAxisDateType
        ? createDateXAxis(XAxisParams, this.props.tickParams!)
        : createNumericXAxis(XAxisParams),
      yScale: createYAxis(YAxisParams),
    });
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
            {children}
          </svg>
        </FocusZone>
        <div ref={(e: HTMLDivElement) => (this.legendContainer = e)} className={this._classNames.legendContainer}>
          {this.props.legendBars}
        </div>
        {!this.props.hideTooltip && calloutProps!.isCalloutVisible && (
          <Callout {...calloutProps}>
            <div className={this._classNames.calloutContentRoot}>
              <div className={this._classNames.calloutDateTimeContainer}>
                <div className={this._classNames.calloutContentX}>{calloutProps!.hoverXValue} </div>
              </div>
              <div className={this._classNames.calloutInfoContainer}>
                {calloutProps!.YValueHover &&
                  calloutProps!.YValueHover.map(
                    (
                      xValue: {
                        legend?: string;
                        y?: number;
                        color?: string;
                        yAxisCalloutData?: string;
                      },
                      index: number,
                    ) => (
                      <div
                        id={`${index}_${xValue.y}`}
                        className={mergeStyles(this._classNames.calloutBlockContainer, {
                          borderLeft: `4px solid ${xValue.color}`,
                        })}
                      >
                        <div className={this._classNames.calloutlegendText}> {xValue.legend}</div>
                        <div className={this._classNames.calloutContentY}>
                          {xValue.yAxisCalloutData ? xValue.yAxisCalloutData : xValue.y}
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </div>
          </Callout>
        )}
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

  private getData = (XAxisParams: IXAxisParams, YAxisParams: IYAxisParams) => {
    const axis = this.props.isXAxisDateType
      ? createDateXAxis(XAxisParams, this.props.tickParams!)
      : createNumericXAxis(XAxisParams);
    this.props.getGraphData &&
      this.props.getGraphData(axis, createYAxis(YAxisParams), this.state.containerHeight, this.state.containerWidth);
  };
}
