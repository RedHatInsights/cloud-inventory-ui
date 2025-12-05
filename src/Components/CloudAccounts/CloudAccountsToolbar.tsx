import { Toolbar, ToolbarContent, ToolbarGroup } from '@patternfly/react-core';
import React from 'react';
import { CloudAccountsPagination } from '../CloudAccounts/CloudAccountsPagination';
import { CloudAccountsFilterList } from './CloudAccountsFilterList';
import { CloudAccountsFilterSelect } from './CloudAccountsFilterSelect';

export const CloudAccountsToolbar = () => {
  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <CloudAccountsFilterSelect />
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <CloudAccountsPagination isCompact />
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <Toolbar>
        <ToolbarContent>
          <CloudAccountsFilterList />
        </ToolbarContent>
      </Toolbar>
    </>
  );
};
