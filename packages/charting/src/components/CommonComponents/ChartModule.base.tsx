import * as React from 'react';
import { classNamesFunction, getId, find } from 'office-ui-fabric-react/lib/Utilities';
import { IProcessedStyleSet, IPalette, mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { IChartModuleProps, IChartModuleStyleProps, IChartModuleStyles } from './ChartModule.types';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { ILegend, Legends } from '../Legends/index';

import {
  calloutData,
  createNumericXAxis,
  createDateXAxis,
  createYAxis,
  fitContainer,
  IMargins,
} from '../../utilities/index';

const getClassNames = classNamesFunction<IChartModuleStyleProps, IChartModuleStyles>();

export interface IRefArrayData {
  index?: string;
  refElement?: SVGGElement;
}

export interface IContainerValues {
  width: number;
  height: number;
  shouldResize: boolean;
  reqID: number;
}

export interface IChartState {
  _width: number;
  _height: number;
  containerWidth: number;
  containerHeight: number;
  isCalloutVisible: boolean;
  YValueHover: { legend?: string; y?: number; color?: string }[];
  hoverYValue: string | number | null;
  hoverXValue: string | number | null;
  refArray: IRefArrayData[];
  activeLegend: string;
  lineColor: string;
  isLegendSelected: boolean;
  // tslint:disable-next-line:no-any
  refSelected: any;
  isLegendHovered: boolean;
  hoveredLineColor: string;
  selectedLegend: string;
}

export class ChartModuleBase extends React.Component<IChartModuleProps, IChartState> {
  // tslint:disable-next-line:no-any
  private _calloutPoints: any;
  // private _points: ILineChartPoints[];
  private _classNames: IProcessedStyleSet<IChartModuleStyles>;
  // tslint:disable-next-line:no-any
  private dataSet: any;
  private _colors: string[];
  private _keys: string[];
  private _refArray: IRefArrayData[];
  private _isGraphDraw: boolean = true;
  private _uniqueIdForGraph: string;
  private _verticalLineId: string;
  private _callOutId: string;
  private xAxisElement: SVGElement | null;
  private yAxisElement: SVGElement | null;
  private _uniqueCallOutID: any;
  private containerParams: IContainerValues;
  private chartContainer: HTMLDivElement;
  private legendContainer: HTMLDivElement;
  private margins: IMargins;

  public constructor(props: IChartModuleProps) {
    super(props);
    this.state = {
      _width: this.props.width || 600,
      _height: this.props.height || 350,
      containerHeight: 0,
      containerWidth: 0,
      isCalloutVisible: false,
      hoverYValue: '',
      refArray: [],
      hoverXValue: '',
      activeLegend: '',
      YValueHover: [],
      lineColor: '',
      refSelected: '',
      hoveredLineColor: '',
      isLegendSelected: false,
      isLegendHovered: false,
      selectedLegend: '',
    };
    this.margins = {
      top: this.props.margins?.top || 20,
      right: this.props.margins?.right || 20,
      bottom: this.props.margins?.bottom || 35,
      left: this.props.margins?.left || 35,
    };
  }

  public componentDidMount(): void {
    this._fitParentContainer();
  }

  public componentWillUnmount(): void {
    cancelAnimationFrame(this.containerParams.reqID);
  }

  public componentDidUpdate(prevProps: IChartModuleProps): void {
    /** note that height and width are not used to resize or set as dimesions of the chart,
     * fitParentContainer is responisble for setting the height and width or resizing of the svg/chart
     */
    if (
      prevProps.height !== this.props.height ||
      prevProps.width !== this.props.width ||
      prevProps.data !== this.props.data
    ) {
      this._fitParentContainer();
    }
  }

  public render(): JSX.Element {
    const { theme, className, styles } = this.props;

    this._classNames = getClassNames(styles!, {
      theme: theme!,
      width: this.state._width,
      height: this.state._height,
      color: this.state.lineColor,
      className,
    });
    // createDateXAxis(this._points, XAxisParams, tickParams);
    // createNumericXAxis(this._points, XAxisParams);

    const svgDimensions = {
      width: this.state.containerWidth,
      height: this.state.containerHeight,
    };
    return (
      <div
        ref={(rootElem: HTMLDivElement) => (this.chartContainer = rootElem)}
        className={this._classNames.root}
        role={'presentation'}
      >
        <FocusZone direction={FocusZoneDirection.horizontal}>
          <svg width={svgDimensions.width} height={svgDimensions.height}>
            <g
              ref={(e: SVGElement | null) => {
                this.xAxisElement = e;
              }}
              transform={`translate(0, ${svgDimensions.height - this.margins.bottom!})`}
              className={this._classNames.xAxis}
            />
            <g
              ref={(e: SVGElement | null) => {
                this.yAxisElement = e;
              }}
              transform={`translate(${this.margins.left}, 0)`}
              className={this._classNames.yAxis}
            />
            <rect height={30} width={30} x={40} y={50} />
          </svg>
        </FocusZone>
        <div ref={(e: HTMLDivElement) => (this.legendContainer = e)} className={this._classNames.legendContainer}>
          Helloooo
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

  private _createKeys = (dataSet: any): string[] => {
    const keysLength: number = Object.keys(dataSet[0]).length;
    const keys: string[] = [];
    for (let i = 0; i < keysLength - 1; i++) {
      const keyVal = `chart${i}`;
      keys.push(keyVal);
    }
    return keys;
  };

  private _onLegendClick(isLegendSelected: boolean, activeLegend: string, customMessage: string): void {
    if (isLegendSelected) {
      if (activeLegend === customMessage) {
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

  private _onLegendHover(isLegendSelected: boolean, activeLegend: string, customMessage: string): void {
    if (isLegendSelected === false) {
      this.setState({
        activeLegend: customMessage,
        isLegendHovered: true,
      });
      this._isGraphDraw = true;
    }
  }

  private _onLegendLeave(isLegendSelected: boolean, isLegendFocused?: boolean) {
    if (!!isLegendFocused || isLegendSelected === false) {
      this.setState({
        activeLegend: '',
        isLegendHovered: false,
        isLegendSelected: !!isLegendFocused ? false : isLegendSelected,
      });
      this._isGraphDraw = true;
    }
  }

  private onMouseHover = (
    target: SVGCircleElement,
    x: number | Date,
    xAxisCalloutData: string,
    calloutPoints: any,
    isLegendSelected: boolean,
    activeLegend: string,
    dataForHoverCard: any,
  ) => {
    const formattedDate = x instanceof Date ? x.toLocaleDateString() : x;
    const found = calloutPoints.find((element: { x: string | number }) => element.x === formattedDate);
    const presentData = found.values[0];
    if (isLegendSelected === false || (isLegendSelected && activeLegend === presentData.legend)) {
      return {
        refSelected: target,
        isCalloutVisible: true,
        activeLegend: presentData.legend,
        dataForHoverCard: presentData.y,
        hoverXValue: xAxisCalloutData ? xAxisCalloutData : formattedDate,
        YValueHover: found.values,
        color: presentData.color,
      };
    }
  };
}
