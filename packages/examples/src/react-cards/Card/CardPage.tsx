import * as React from 'react';
import {
  ExampleCard,
  IComponentDemoPageProps,
  ComponentPage,
  Markdown,
  PropertiesTableSet,
} from '@uifabric/example-app-base';

import { CardVerticalExample } from './Card.Vertical.Example';
const CardVerticalExampleCode = require('!raw-loader!@fluentui/examples/src/react-cards/Card/Card.Vertical.Example.tsx') as string;

import { CardHorizontalExample } from './Card.Horizontal.Example';
const CardHorizontalExampleCode = require('!raw-loader!@fluentui/examples/src/react-cards/Card/Card.Horizontal.Example.tsx') as string;

import { CardConfigureExample } from './Card.Configure.Example';
const CardConfigureExampleCode = require('!raw-loader!@fluentui/examples/src/react-cards/Card/Card.Configure.Example.tsx') as string;

export class CardPage extends React.Component<IComponentDemoPageProps, {}> {
  public render(): JSX.Element {
    return (
      <ComponentPage
        title="Card"
        componentName="Card"
        exampleCards={
          <div>
            <ExampleCard title="Vertical Card" code={CardVerticalExampleCode}>
              <CardVerticalExample />
            </ExampleCard>
            <ExampleCard title="Horizontal Card" code={CardHorizontalExampleCode}>
              <CardHorizontalExample />
            </ExampleCard>
            <ExampleCard title="Configure Properties" code={CardConfigureExampleCode}>
              <CardConfigureExample />
            </ExampleCard>
          </div>
        }
        propertiesTables={
          <PropertiesTableSet
            sources={[require<string>('!raw-loader!@uifabric/react-cards/src/components/Card/Card.types.ts')]}
          />
        }
        overview={
          <Markdown>
            {require<string>('!raw-loader!@fluentui/examples/src/react-cards/Card/docs/CardOverview.md')}
          </Markdown>
        }
        bestPractices={<div />}
        dos={
          <Markdown>{require<string>('!raw-loader!@fluentui/examples/src/react-cards/Card/docs/CardDos.md')}</Markdown>
        }
        donts={
          <Markdown>
            {require<string>('!raw-loader!@fluentui/examples/src/react-cards/Card/docs/CardDonts.md')}
          </Markdown>
        }
        isHeaderVisible={this.props.isHeaderVisible}
      />
    );
  }
}
