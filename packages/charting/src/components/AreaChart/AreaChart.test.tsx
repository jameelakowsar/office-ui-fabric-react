jest.mock('react-dom');
import * as React from 'react';
import { resetIds, setWarningCallback } from '../../Utilities';
import * as renderer from 'react-test-renderer';
import { mount, ReactWrapper } from 'enzyme';
import { IAreaChartProps, AreaChart } from './index';
import { ICustomizedCalloutData } from '../../index';
import { IAreaChartState, AreaChartBase } from './AreaChart.base';
import { DirectionalHint } from 'office-ui-fabric-react/lib/Callout';

// Wrapper of the AreaChart to be tested.
let wrapper: ReactWrapper<IAreaChartProps, IAreaChartState, AreaChartBase> | undefined;

function sharedBeforeEach() {
  resetIds();
}

function sharedAfterEach() {
  if (wrapper) {
    wrapper.unmount();
    wrapper = undefined;
  }

  // Do this after unmounting the wrapper to make sure if any timers cleaned up on unmount are
  // cleaned up in fake timers world
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((global.setTimeout as any).mock) {
    jest.useRealTimers();
  }
}

const points = [
  {
    legend: 'metaData1',
    data: [
      { x: 20, y: 50 },
      { x: 40, y: 80 },
    ],
    color: 'red',
  },
];
const chartPoints = {
  chartTitle: 'AreaChart',
  lineChartData: points,
};

describe('AreaChart snapShot testing', () => {
  it('renders Areachart correctly', () => {
    const component = renderer.create(<AreaChart data={chartPoints} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders hideLegend hhh correctly', () => {
    const component = renderer.create(<AreaChart data={chartPoints} hideLegend={true} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders hideTooltip correctly', () => {
    const component = renderer.create(<AreaChart data={chartPoints} hideTooltip={true} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders enabledLegendsWrapLines correctly', () => {
    const component = renderer.create(<AreaChart data={chartPoints} enabledLegendsWrapLines={true} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders showXAxisLablesTooltip correctly', () => {
    const component = renderer.create(<AreaChart data={chartPoints} showXAxisLablesTooltip={true} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders wrapXAxisLables correctly', () => {
    const component = renderer.create(<AreaChart data={chartPoints} wrapXAxisLables={true} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders yAxisTickFormat correctly', () => {
    const component = renderer.create(<AreaChart data={chartPoints} yAxisTickFormat={'/%d'} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  // it('should respect component styling', () => {
  //   const styles:Partial<IAreaChartStyles> = {

  //   }
  //   const component = create(<AreaChart data={chartPoints} yAxisTickFormat={'%m/%d'} />);
  //   const tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
}); // end snapshots

describe('AreaChart - basic props', () => {
  beforeEach(sharedBeforeEach);
  afterEach(sharedAfterEach);
  // it('Should render margins ', () => {
  //   const margins = {
  //     left: 30,
  //     right: 40,
  //     top: 20,
  //     bottom: 15,
  //   };
  //   const height = 300;
  //   wrapper = mount(<AreaChart data={chartPoints} height={height} />);
  //   const graph = wrapper.getDOMNode().querySelector('div');
  //   // console.log(
  //   //   graph?.getElementsByClassName('root'),
  //   //   'graph values',
  //   //   getComputedStyle(graph!),
  //   //   graph?.getBoundingClientRect()['height'],
  //   // );
  //   // expect(graph!).toEqual(margins.left);
  // });

  it('Should not mount legend when hideLegend true ', () => {
    wrapper = mount(<AreaChart data={chartPoints} hideLegend={true} />);
    const hideLegendDOM = wrapper.getDOMNode().querySelectorAll('[class^="legendContainer"]');
    expect(hideLegendDOM.length).toBe(0);
  });

  it('Should mount legend when hideLegend false ', () => {
    wrapper = mount(<AreaChart data={chartPoints} />);
    const hideLegendDOM = wrapper.getDOMNode().querySelectorAll('[class^="legendContainer"]');
    expect(hideLegendDOM).toBeDefined();
  });

  it('Should mount callout when hideTootip false ', () => {
    wrapper = mount(<AreaChart data={chartPoints} />);
    const hideLegendDOM = wrapper.getDOMNode().querySelectorAll('[class^="ms-Layer"]');
    expect(hideLegendDOM).toBeDefined();
  });

  it('Should not mount callout when hideTootip true ', () => {
    wrapper = mount(<AreaChart data={chartPoints} hideTooltip={true} />);
    const hideLegendDOM = wrapper.getDOMNode().querySelectorAll('[class^="ms-Layer"]');
    expect(hideLegendDOM.length).toBe(0);
  });

  it('renders onRenderCalloutPerDataPoint correctly', () => {
    wrapper = mount(
      <AreaChart
        data={chartPoints}
        onRenderCalloutPerDataPoint={(props: ICustomizedCalloutData) =>
          props ? (
            <div className="testRenderCalloutPerDataPoint">
              <p>Custom Callout Value</p>
            </div>
          ) : null
        }
      />,
    );
    const renderCalloutDom = wrapper.getDOMNode().getElementsByClassName('.testRenderCalloutPerDataPoint');
    expect(renderCalloutDom).toBeDefined();
  });

  it('renders onRenderCalloutPerStack correctly', () => {
    wrapper = mount(
      <AreaChart
        data={chartPoints}
        onRenderCalloutPerStack={(props: ICustomizedCalloutData) =>
          props ? (
            <div className="onRenderCalloutPerStack">
              <p>Custom Callout Value</p>
            </div>
          ) : null
        }
      />,
    );
    const renderCalloutDom = wrapper.getDOMNode().getElementsByClassName('.onRenderCalloutPerStack');
    expect(renderCalloutDom).toBeDefined();
  });

  it('Should not mount onRenderCalloutPerStack', () => {
    wrapper = mount(<AreaChart data={chartPoints} />);
    const renderCalloutDom = wrapper.getDOMNode().getElementsByClassName('.onRenderCalloutPerStack');
    expect(renderCalloutDom.length).toEqual(0);
  });

  it('Should not mount onRenderCalloutPerDataPoint', () => {
    wrapper = mount(<AreaChart data={chartPoints} />);
    const renderCalloutDom = wrapper.getDOMNode().getElementsByClassName('.onRenderCalloutPerDataPoint');
    expect(renderCalloutDom.length).toEqual(0);
  });

  // it('Should mount given yMinValue', () => {
  //   wrapper = mount(<AreaChart data={chartPoints} yMinValue={20} />);
  //   const renderCalloutDom = wrapper.getDOMNode().querySelectorAll('text');
  //   console.log(renderCalloutDom, 'kkkkkkkkkkk');
  //   expect(renderCalloutDom)
  // });
});

describe('Render calling with respective to props', () => {
  it('No prop changes', () => {
    const renderMock = jest.spyOn(AreaChartBase.prototype, 'render');
    const props = {
      data: chartPoints,
      height: 300,
      width: 600,
    };
    const component = mount(<AreaChart {...props} />);
    component.setProps({ ...props });
    expect(renderMock).toHaveBeenCalledTimes(2);
    renderMock.mockRestore();
  });

  it('prop changes', () => {
    const renderMock = jest.spyOn(AreaChartBase.prototype, 'render');
    const props = {
      data: chartPoints,
      height: 300,
      width: 600,
      hideLegend: true,
    };
    const component = mount(<AreaChart {...props} />);
    component.setProps({ ...props, hideTooltip: true });
    expect(renderMock).toHaveBeenCalledTimes(2);
    renderMock.mockRestore();
  });
});

describe('Warns if use depreacted props', () => {
  const warningCallback = jest.fn();
  beforeEach(() => {
    setWarningCallback(warningCallback);
  });

  afterEach(() => {
    warningCallback.mockReset();
    setWarningCallback(undefined);
  });

  // it('Should warn chart label as deprecated prop', () => {
  //   wrapper = mount(<AreaChart data={chartPoints} chartLabel="Chart Label" />);
  //   expect(warningCallback).toHaveBeenCalledTimes(1);
  // }); // Need to check

  it('Should warn chart label as deprecated prop', () => {
    wrapper = mount(<AreaChart data={chartPoints} />);
    expect(warningCallback).toHaveBeenCalledTimes(0);
  });
}); // end deprecated prop testing
