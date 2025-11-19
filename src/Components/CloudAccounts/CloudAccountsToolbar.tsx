import { Toolbar, ToolbarContent, ToolbarGroup } from '@patternfly/react-core';
import React from 'react';
// import { CloudProviderFilterSelect } from './CloudProviderFilterSelect';
import { CloudAccountsPagination } from '../CloudAccounts/CloudAccountsPagination';
import { CloudAccountsFilterList } from './CloudAccountsFilterSelect';
// import { CloudProviderFilterList } from './CloudProviderFilterList';

// interface CloudAccountsFilterBarProps {
//   cloudAccounts: CloudAccountsResponse;
// }

export const CloudAccountsToolbar = () => {
  // const cloudProviders = Object.values(cloudAccounts).map(
  //   (cloudAccounts) => cloudAccounts.provider
  // );

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <CloudAccountsFilterList />
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <CloudAccountsPagination isCompact />
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <Toolbar>
        <ToolbarContent></ToolbarContent>
      </Toolbar>
    </>
  );
};
