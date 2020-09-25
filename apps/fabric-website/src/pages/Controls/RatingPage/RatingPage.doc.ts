import { TFabricPlatformPageProps } from '../../../interfaces/Platforms';
import { RatingPageProps as ExternalProps } from '@fluentui/examples/lib/office-ui-fabric-react/Rating/Rating.doc';

const related = require('!raw-loader!@uifabric/fabric-website/src/pages/Controls/RatingPage/docs/RatingRelated.md') as string;

export const RatingPageProps: TFabricPlatformPageProps = {
  web: {
    ...(ExternalProps as any),
    related,
  },
};
