import { IGroupedVerticalBarChartProps, IGroupedVerticalBarChartStyles } from './GroupedVerticalBarChart.types';

export const getStyles = (props: IGroupedVerticalBarChartProps): IGroupedVerticalBarChartStyles => {
  const { theme, width, height, className, showXAxisPath, legendColor, shouldHighlight } = props;
  return {
    root: [
      theme!.fonts.medium, // check this theme obj may undefined case
      {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      },
      className,
    ],

    xAxis: {
      selectors: {
        text: {
          ...theme!.fonts.tiny,
        },
        line: {
          opacity: 0.2, // change them later
          width: '1px',
        },
        path: {
          display: 'none', // chnage based on showYAxisPath
        },
      },
    },

    yAxis: {
      selectors: {
        text: {
          ...theme!.fonts.medium,
          // opacity: 1,
        },
        line: {
          opacity: 0.2, // change them later
          width: '1px',
        },
        path: {
          display: 'none', // change based on showXAxisPath
        },
      },
    },

    legendContainer: {
      marginTop: '8px',
      marginLeft: '35px',
    },

    hoverCardRoot: {
      paddingLeft: '16px',
      paddingRight: '22px',
      paddingTop: '15px',
      paddingBottom: '8px',
    },

    hoverCardTextStyles: [
      theme.fonts.small,
      {
        lineHeight: '14px',
      },
    ],

    hoverCardDataStyles: [
      theme.fonts.xxLarge,
      {
        lineHeight: '31px',
        color: legendColor === '' ? theme.palette.black : legendColor,
      },
    ],

    opacityChangeOnHover: {
      opacity: shouldHighlight ? '' : '0.1',
      // cursor: href ? 'pointer' : 'default',
    },
  };
};
