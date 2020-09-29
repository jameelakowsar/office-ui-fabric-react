import * as React from 'react';
import { ModalBasicExample } from './Modal.Basic.Example';
import { ModalModelessExample } from './Modal.Modeless.Example';

import { IDocPageProps } from 'office-ui-fabric-react/lib/common/DocPage.types';

const ModalBasicExampleCode = require('!raw-loader!@fluentui/react-examples/src/office-ui-fabric-react/Modal/Modal.Basic.Example.tsx') as string;
const ModalModelessExampleCode = require('!raw-loader!@fluentui/react-examples/src/office-ui-fabric-react/Modal/Modal.Modeless.Example.tsx') as string;

export const ModalPageProps: IDocPageProps = {
  title: 'Modal',
  componentName: 'Modal',
  componentUrl:
    'https://github.com/microsoft/fluentui/tree/master/packages/office-ui-fabric-react/src/components/Modal',
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
  overview: require<
    string
  >('!raw-loader!@fluentui/react-examples/src/office-ui-fabric-react/Modal/docs/ModalOverview.md'),
  bestPractices: require<
    string
  >('!raw-loader!@fluentui/react-examples/src/office-ui-fabric-react/Modal/docs/ModalBestPractices.md'),
  isHeaderVisible: true,
  isFeedbackVisible: true,
};
