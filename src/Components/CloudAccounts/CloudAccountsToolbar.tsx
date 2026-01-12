import { Toolbar, ToolbarContent, ToolbarGroup } from '@patternfly/react-core';
import React from 'react';
import { CloudAccountsPagination } from '../CloudAccounts/CloudAccountsPagination';

export const CloudAccountsToolbar = () => {
  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <ToolbarGroup align={{ default: 'alignEnd' }}>
            <CloudAccountsPagination isCompact />
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
    </>
  );
};
