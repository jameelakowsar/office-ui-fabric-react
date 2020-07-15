import * as React from 'react';

import { ComponentPage, ExampleCard, IComponentDemoPageProps, PropertiesTableSet } from '@uifabric/example-app-base';

import { ChartModuleBasicExample } from './Examples/ChartModule.Basic.Example';
import { ChartExtendedExample } from './examples/Chart.Extended.Example';

const ChartBasicExampleCode = require('!raw-loader!@uifabric/charting/src/components/CommonComponents/Examples/Chart.Basic.Example.tsx') as string;
const ChartExtendedExampleCode = require('!raw-loader!@uifabric/charting/src/components/CommonComponents/Examples/Chart.Basic.Example.tsx') as string;

export class VerticalBarChartPage extends React.Component<IComponentDemoPageProps, {}> {
  public render(): JSX.Element {
    return (
      <ComponentPage
        title="VerticalBarChart"
        componentName="VerticalBarChartExample"
        exampleCards={
          <div>
            <ExampleCard title="VerticalStackedBarChart basic" code={ChartBasicExampleCode}>
              <ChartModuleBasicExample />
            </ExampleCard>
            <ExampleCard title="VerticalStackedBarChart Styled" code={ChartExtendedExampleCode}>
              <ChartExtendedExample />
            </ExampleCard>
          </div>
        }
        propertiesTables={
          <PropertiesTableSet
            sources={[
              require<
                string
                // tslint:disable-next-line: max-line-length
              >('!raw-loader!@uifabric/charting/src/components/VerticalStackedBarChart/VerticalStackedBarChart.types.ts'),
            ]}
          />
        }
        /* tslint:disable:max-line-length */
        overview={
          <div>
            <p>VerticalStackedBarChart description</p>
          </div>
        }
        /* tslint:enable:max-line-length */
        bestPractices={<div />}
        dos={
          <div>
            <ul>
              <li />
            </ul>
          </div>
        }
        donts={
          <div>
            <ul>
              <li />
            </ul>
          </div>
        }
        isHeaderVisible={this.props.isHeaderVisible}
      />
    );
  }
}
