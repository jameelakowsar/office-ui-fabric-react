import * as React from 'react';
import cx from 'classnames';
import { TeamsProcessedSvgIconSpec } from '../types';
import { teamsIconClassNames } from '../teamsIconClassNames';

export default {
  icon: ({ classes }) => (
    <svg role="presentation" focusable="false" viewBox="8 8 16 16" className={classes.svg}>
      <g>
        <path
          className={cx(teamsIconClassNames.outline, classes.outlinePart)}
          d="M22.7 9.3a2.746 2.746 0 0 0-3.88 0l-2.38 2.379a2.745 2.745 0 0 0-.318 3.491l-.951.951a2.744 2.744 0 0 0-3.491.318l-2.38 2.38a2.743 2.743 0 0 0 3.88 3.88l2.38-2.379a2.745 2.745 0 0 0 .318-3.491l.951-.951a2.737 2.737 0 0 0 3.491-.318l2.38-2.379a2.746 2.746 0 0 0 0-3.881zm-7.846 10.313l-2.38 2.379a1.744 1.744 0 1 1-2.466-2.466l2.38-2.379a1.721 1.721 0 0 1 2.054-.3l-.778.779a.5.5 0 1 0 .707.707l.778-.778a1.741 1.741 0 0 1-.295 2.058zm7.139-7.139l-2.38 2.379a1.741 1.741 0 0 1-2.054.3l.778-.779a.5.5 0 0 0-.707-.707l-.778.778a1.741 1.741 0 0 1 .3-2.054l2.38-2.379a1.744 1.744 0 1 1 2.46 2.462z"
        />
        <path
          className={cx(teamsIconClassNames.filled, classes.filledPart)}
          d="M24 11.242a3.222 3.222 0 0 1-.246 1.238 3.189 3.189 0 0 1-.7 1.051l-2.383 2.383a3.184 3.184 0 0 1-1.051.7 3.223 3.223 0 0 1-1.238.246 3.343 3.343 0 0 1-.762-.086 2.936 2.936 0 0 1-.715-.266l-.4.4a3.051 3.051 0 0 1 .266.715 3.411 3.411 0 0 1 .086.762 3.249 3.249 0 0 1-.945 2.289l-2.383 2.383a3.179 3.179 0 0 1-1.051.7 3.223 3.223 0 0 1-1.236.243 3.144 3.144 0 0 1-1.262-.254 3.256 3.256 0 0 1-1.726-1.726A3.151 3.151 0 0 1 8 20.758a3.223 3.223 0 0 1 .246-1.238 3.191 3.191 0 0 1 .7-1.051l2.383-2.383a3.189 3.189 0 0 1 1.051-.7 3.222 3.222 0 0 1 1.238-.246 3.377 3.377 0 0 1 .762.086 3.029 3.029 0 0 1 .715.266l.4-.4a2.962 2.962 0 0 1-.266-.719 3.362 3.362 0 0 1-.086-.758 3.223 3.223 0 0 1 .246-1.238 3.186 3.186 0 0 1 .7-1.051l2.383-2.383a3.25 3.25 0 0 1 3.551-.691 3.256 3.256 0 0 1 1.723 1.728A3.164 3.164 0 0 1 24 11.242zm-9.156 7.328a2.084 2.084 0 0 1-.367.3.854.854 0 0 1-.461.117.964.964 0 0 1-.387-.078 1 1 0 0 1-.535-.535.972.972 0 0 1-.078-.387.855.855 0 0 1 .117-.461 2.084 2.084 0 0 1 .3-.367 1.207 1.207 0 0 0-.687.344l-2.383 2.383a1.233 1.233 0 0 0-.359.875 1.178 1.178 0 0 0 .1.48 1.271 1.271 0 0 0 .27.395 1.255 1.255 0 0 0 .395.27 1.178 1.178 0 0 0 .48.1 1.236 1.236 0 0 0 .477-.094 1.208 1.208 0 0 0 .4-.266l2.374-2.388a1.206 1.206 0 0 0 .344-.688zM22 11.242a1.194 1.194 0 0 0-.1-.48 1.291 1.291 0 0 0-.664-.664 1.186 1.186 0 0 0-.48-.1 1.231 1.231 0 0 0-.477.094 1.213 1.213 0 0 0-.4.266L17.5 12.742a1.2 1.2 0 0 0-.344.688 2.071 2.071 0 0 1 .367-.3.853.853 0 0 1 .461-.117.988.988 0 0 1 .387.078 1 1 0 0 1 .535.535.984.984 0 0 1 .078.387.853.853 0 0 1-.117.461 2.111 2.111 0 0 1-.3.367 1.206 1.206 0 0 0 .688-.344l2.383-2.383a1.213 1.213 0 0 0 .266-.4 1.232 1.232 0 0 0 .096-.472z"
        />
      </g>
    </svg>
  ),
  styles: {},
  exportedAs: 'link',
} as TeamsProcessedSvgIconSpec;
