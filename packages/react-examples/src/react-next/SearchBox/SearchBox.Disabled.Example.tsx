import * as React from 'react';
import { SearchBox } from '@fluentui/react-next/lib/SearchBox';
import { Stack, IStackTokens } from '@fluentui/react-next/lib/Stack';

const stackTokens: Partial<IStackTokens> = { childrenGap: 20 };

export const SearchBoxDisabledExample = () => (
  <Stack tokens={stackTokens}>
    <SearchBox placeholder="Search" disabled />
    <SearchBox placeholder="Search" underlined={true} disabled />
  </Stack>
);
