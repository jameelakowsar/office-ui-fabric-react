import * as React from 'react';

import { IDocPageProps } from '@fluentui/react-next/lib/common/DocPage.types';

import { FocusTrapZoneBoxExample } from './FocusTrapZone.Box.Example';
const FocusTrapZoneBoxExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-next/FocusTrapZone/FocusTrapZone.Box.Example.tsx') as string;

import { FocusTrapZoneBoxCustomElementExample } from './FocusTrapZone.Box.FocusOnCustomElement.Example';
const FocusTrapZoneBoxCustomElementExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-next/FocusTrapZone/FocusTrapZone.Box.FocusOnCustomElement.Example.tsx') as string;

import { FocusTrapZoneBoxClickExample } from './FocusTrapZone.Box.Click.Example';
const FocusTrapZoneBoxClickExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-next/FocusTrapZone/FocusTrapZone.Box.Click.Example.tsx') as string;

import { FocusTrapZoneNestedExample } from './FocusTrapZone.Nested.Example';
const FocusTrapZoneNestedExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-next/FocusTrapZone/FocusTrapZone.Nested.Example.tsx') as string;

import { FocusTrapZoneFocusZoneExample } from './FocusTrapZone.FocusZone.Example';
const FocusTrapZoneFocusZoneExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-next/FocusTrapZone/FocusTrapZone.FocusZone.Example.tsx') as string;

import { FocusTrapZoneDialogInPanelExample } from './FocusTrapZone.DialogInPanel.Example';
const FocusTrapZoneDialogInPanelExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-next/FocusTrapZone/FocusTrapZone.DialogInPanel.Example.tsx') as string;

export const FocusTrapZonePageProps: IDocPageProps = {
  title: 'FocusTrapZone',
  componentName: 'FocusTrapZone',
  componentUrl: 'https://github.com/microsoft/fluentui/tree/master/packages/react-next/src/components/FocusTrapZone',
  examples: [
    {
      title: 'Simple box',
      code: FocusTrapZoneBoxExampleCode,
      view: <FocusTrapZoneBoxExample />,
    },
    {
      title: 'Simple box with focus on custom focusable element',
      code: FocusTrapZoneBoxCustomElementExampleCode,
      view: <FocusTrapZoneBoxCustomElementExample />,
    },
    {
      title: 'Simple box with clicking outside trap zone enabled',
      code: FocusTrapZoneBoxClickExampleCode,
      view: <FocusTrapZoneBoxClickExample />,
    },
    {
      title: 'Multiple nested FocusTrapZones',
      code: FocusTrapZoneNestedExampleCode,
      view: <FocusTrapZoneNestedExample />,
    },
    {
      title: 'FocusTrapZone with FocusZones',
      code: FocusTrapZoneFocusZoneExampleCode,
      view: <FocusTrapZoneFocusZoneExample />,
    },
    {
      title: 'A Dialog nested in a Panel',
      code: FocusTrapZoneDialogInPanelExampleCode,
      view: <FocusTrapZoneDialogInPanelExample />,
    },
  ],
  overview: require<
    string
  >('!raw-loader!@fluentui/react-examples/src/react-next/FocusTrapZone/docs/FocusTrapZoneOverview.md'),
  bestPractices: require<
    string
  >('!raw-loader!@fluentui/react-examples/src/react-next/FocusTrapZone/docs/FocusTrapZoneBestPractices.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true,
  allowNativeProps: true,
};
