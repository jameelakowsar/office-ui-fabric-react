import * as React from 'react';
import { ModalBasicExample } from './Modal.Basic.Example';
import { ModalModelessExample } from './Modal.Modeless.Example';

import { IDocPageProps } from '@fluentui/react-next/lib/common/DocPage.types';

const ModalBasicExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-next/Modal/Modal.Basic.Example.tsx') as string;
const ModalModelessExampleCode = require('!raw-loader!@fluentui/react-examples/src/react-next/Modal/Modal.Modeless.Example.tsx') as string;

export const ModalPageProps: IDocPageProps = {
  title: 'Modal',
  componentName: 'Modal',
  componentUrl: 'https://github.com/microsoft/fluentui/tree/master/packages/@fluentui/react-next/src/components/Modal',
  examples: [
    {
      title: 'Modal',
      code: ModalBasicExampleCode,
      view: <ModalBasicExample />,
    },
    {
      title: 'Modeless Modal',
      code: ModalModelessExampleCode,
      view: <ModalModelessExample />,
    },
  ],
  overview: require<string>('!raw-loader!@fluentui/react-examples/src/react-next/Modal/docs/ModalOverview.md'),
  bestPractices: require<
    string
  >('!raw-loader!@fluentui/react-examples/src/react-next/Modal/docs/ModalBestPractices.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true,
};
