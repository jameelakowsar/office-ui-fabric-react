import * as React from 'react';
import { TeamsProcessedSvgIconSpec } from '../types';
import { teamsIconClassNames } from '../teamsIconClassNames';
import cx from 'classnames';

export default {
  icon: ({ classes }) => (
    <svg role="presentation" focusable="false" viewBox="8 8 16 16" className={classes.svg}>
      <path
        className={cx(teamsIconClassNames.filled, classes.filledPart)}
        d="M10.84 9.5a1.9 1.9 0 011.39.45 2.32 2.32 0 01.31.44 5.66 5.66 0 01.81 2.61c0 1.19-.62 1.65-1.35 2.44L14.41 19a4.44 4.44 0 011.84-.63 2.63 2.63 0 011.34.38c.72.4 2 1.55 2 2.43a3.38 3.38 0 01-.21 1c-.25.77-.52 1.26-1.42 1.26a8.83 8.83 0 01-2.85-1.07A12.37 12.37 0 019 11.72c0-.8 0-1.8.92-2.14a4.6 4.6 0 01.92-.08zm8.44 5.5a.29.29 0 00-.29.29v.42a.29.29 0 00.29.29h.42a.29.29 0 00.29-.29v-.42a.29.29 0 00-.29-.29zm.21-6a1.12 1.12 0 011 .56l3.14 5.83a1.1 1.1 0 01.12.51 1.07 1.07 0 01-1.13 1.1h-6.26a1.09 1.09 0 01-1.09-1.08 1 1 0 01.13-.51l3.14-5.82a1.06 1.06 0 01.95-.59zm0 2a.51.51 0 00-.5.5V14a.51.51 0 00.5.5.5.5 0 00.51-.5v-2.5a.5.5 0 00-.51-.5z"
      />
      <path
        className={cx(teamsIconClassNames.outline, classes.outlinePart)}
        d="M11.47 9.5a1.64 1.64 0 011.22.48 5.34 5.34 0 011.18 3c0 1.49-1.31 2-1.31 2.5a20.61 20.61 0 002 3 .5.5 0 00.42.21c.44 0 1.08-.55 1.76-.55a2.87 2.87 0 011.34.37 6.37 6.37 0 011.79 1.64 1.76 1.76 0 01.3 1 1.72 1.72 0 01-.26.91 5 5 0 01-1.22 1.22 1.35 1.35 0 01-.75.21 9 9 0 01-2.82-1.05A11.83 11.83 0 019 12.11c0-1.26.1-1.7 1.28-2.27a3.18 3.18 0 011.19-.34zm0 1a1.49 1.49 0 00-.58.17c-.59.26-.9.3-.9 1.05a11.44 11.44 0 00.26 2.73 10.81 10.81 0 005.39 7.13q.24.14.48.24a7.43 7.43 0 001.88.68c.41 0 1.23-.93 1.23-1.34s-1-1.41-1.5-1.69a1.81 1.81 0 00-.93-.28c-.64 0-1.13.54-1.76.54a1.51 1.51 0 01-1.24-.64l-1.93-2.75a1.5 1.5 0 01-.28-.86c0-1.21 1.31-1.36 1.31-2.51a4.77 4.77 0 00-.74-2.1.78.78 0 00-.69-.37zm7.81 4.5a.29.29 0 00-.29.29v.42a.29.29 0 00.29.29h.42a.29.29 0 00.29-.29v-.42a.29.29 0 00-.29-.29zm.21-6a1.12 1.12 0 011 .56l3.14 5.83a1.1 1.1 0 01.12.51 1.07 1.07 0 01-1.13 1.1h-6.26a1.09 1.09 0 01-1.09-1.08 1 1 0 01.13-.51l3.14-5.82a1.08 1.08 0 01.95-.59zm0 2a.51.51 0 00-.5.5V14a.51.51 0 00.5.5.5.5 0 00.51-.5v-2.5a.5.5 0 00-.51-.5z"
      />
    </svg>
  ),
  styles: {},
} as TeamsProcessedSvgIconSpec;
