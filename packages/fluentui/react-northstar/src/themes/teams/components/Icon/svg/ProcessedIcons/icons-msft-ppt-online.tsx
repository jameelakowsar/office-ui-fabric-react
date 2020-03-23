import * as React from 'react';
import { TeamsProcessedSvgIconSpec } from '../types';

export default {
  icon: ({ classes }) => (
    <svg role="presentation" focusable="false" viewBox="8 8 16 16" className={classes.svg}>
      <path d="M8.5 10.477l9-2.079v15.204l-9-2.079V10.477zM11 19.03l1.164.133V17l.578-.04c.078-.004.156-.007.235-.007s.158-.005.242-.016a1.924 1.924 0 0 0 1.289-.722c.15-.19.267-.406.348-.649.08-.242.12-.496.12-.761 0-.62-.152-1.103-.456-1.45-.305-.346-.778-.519-1.418-.519-.35 0-.7.013-1.051.04-.352.026-.702.049-1.05.07v6.085zm2.625-4.148c0 .328-.081.578-.242.75-.162.172-.41.258-.742.258h-.477V14c.088-.01.18-.023.273-.04s.188-.023.282-.023c.312 0 .541.083.687.247.146.164.219.397.219.699zM23 10.5c.052 0 .106.017.164.05a.858.858 0 0 1 .285.286c.033.058.051.112.051.164v10a.327.327 0 0 1-.05.164.82.82 0 0 1-.286.285.323.323 0 0 1-.164.051h-5V20h4v-.5h-4v-1h4V18h-4v-1.781c.15.089.31.158.48.207a1.944 1.944 0 0 0 1.297-.082A2.007 2.007 0 0 0 21 14.5h-2v-2c-.178 0-.35.025-.52.074-.17.05-.33.119-.48.207V10.5h5zM21.5 14c0-.276-.053-.535-.156-.777a2.032 2.032 0 0 0-1.066-1.066A1.95 1.95 0 0 0 19.5 12v2h2z" />
    </svg>
  ),
  styles: {},
} as TeamsProcessedSvgIconSpec;
