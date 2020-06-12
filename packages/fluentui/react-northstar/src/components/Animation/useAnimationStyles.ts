import {
  ComponentAnimationProp,
  unstable_getStyles as getStyles,
  unstable_createAnimationStyles as createAnimationStyles,
} from '@fluentui/react-bindings';
import { ProviderContextPrepared } from '../../types';
import { ThemePrepared } from '@fluentui/styles';
import * as React from 'react';
// @ts-ignore
import { ThemeContext } from 'react-fela';
import * as _ from 'lodash';
import { AnimationProps } from './Animation';

type UseAnimationStylesResult = {
  className: string;
  animationDuration?: string;
  animationDelay?: string;
};

const animationCache = new WeakMap<ThemePrepared, Record<string, UseAnimationStylesResult>>();
export const animationClassName = 'ui-animation';

const useAnimationStyles = (displayName: string, props: AnimationProps): UseAnimationStylesResult => {
  const { theme, rtl, disableAnimations, renderer, performance }: ProviderContextPrepared = React.useContext(
    ThemeContext,
  );

  if (disableAnimations) {
    return {
      className: animationClassName,
      animationDuration: '0ms',
      animationDelay: '0ms',
    };
  }

  const animation: ComponentAnimationProp = {
    name: props.name,
    keyframeParams: props.keyframeParams,
    duration: props.duration,
    delay: props.delay,
    iterationCount: props.iterationCount,
    direction: props.direction,
    fillMode: props.fillMode,
    playState: props.playState,
    timingFunction: props.timingFunction,
  };

  const cacheEnabled = performance.enableStylesCaching;

  let cachePerTheme = {};
  let cacheKey = '';

  if (cacheEnabled) {
    if (!animationCache.has(theme)) {
      animationCache.set(theme, {});
    }

    cachePerTheme = animationCache.get(theme);
    cacheKey = JSON.stringify(animation);

    if (cachePerTheme[cacheKey]) {
      return cachePerTheme[cacheKey];
    }
  }

  const { classes, styles } = getStyles({
    allDisplayNames: [displayName],
    className: animationClassName,
    primaryDisplayName: displayName,
    props: {
      styles: createAnimationStyles(animation, theme),
    },

    disableAnimations,
    renderer,
    rtl,
    performance: {
      enableSanitizeCssPlugin: false,
      enableStylesCaching: false,
      enableVariablesCaching: false,
      enableBooleanVariablesCaching: false,
    },
    saveDebug: _.noop,
    theme,
  });

  const result = {
    className: classes.root,
    animationDuration: styles.root.animationDuration,
    animationDelay: styles.root.animationDelay,
  };

  if (cacheEnabled) {
    cachePerTheme[cacheKey] = result;
    animationCache.set(theme, cachePerTheme);
  }
  return result;
};

export default useAnimationStyles;
