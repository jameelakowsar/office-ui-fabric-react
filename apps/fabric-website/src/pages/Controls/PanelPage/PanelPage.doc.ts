import { TFabricPlatformPageProps } from '../../../interfaces/Platforms';
import { PanelPageProps as ExternalProps } from '@fluentui/examples/lib/office-ui-fabric-react/Panel/Panel.doc';

const related = require('!raw-loader!@uifabric/fabric-website/src/pages/Controls/PanelPage/docs/PanelRelated.md') as string;

export const PanelPageProps: TFabricPlatformPageProps = {
  web: {
    ...(ExternalProps as any),
    related,
  },
};
