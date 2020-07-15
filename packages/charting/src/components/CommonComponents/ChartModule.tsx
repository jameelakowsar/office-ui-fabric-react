import { styled } from 'office-ui-fabric-react/lib/Utilities';
import { IChartModuleProps, IChartModuleStyleProps, IChartModuleStyles } from './ChartModule.types';
import { ChartModuleBase } from './ChartModule.base';
import { getStyles } from './ChartModule.styles';

// Create a LineChart variant which uses these default styles and this styled subcomponent.
export const LineChart: React.FunctionComponent<IChartModuleProps> = styled<
  IChartModuleProps,
  IChartModuleStyleProps,
  IChartModuleStyles
>(ChartModuleBase, getStyles);
