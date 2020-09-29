import { TFabricPlatformPageProps } from '../../../interfaces/Platforms';
import { ModalPageProps as ExternalProps } from '@fluentui/react-examples/lib/office-ui-fabric-react/Modal/Modal.doc';

const related = require('!raw-loader!@uifabric/fabric-website/src/pages/Controls/ModalPage/docs/ModalRelated.md') as string;

export const ModalPageProps: TFabricPlatformPageProps = {
  web: {
    ...(ExternalProps as any),
    related,
  },
};
