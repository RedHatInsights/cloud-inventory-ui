import React from 'react';
import { Toolbar, ToolbarContent, ToolbarGroup } from '@patternfly/react-core';
import { MarketplacePurchasesPagination } from './MarketplacePurchasesPagination';

export const MarketplacePurchasesToolbar = () => {
  return (
    <Toolbar id="marketplace-purchases-toolbar">
      <ToolbarContent>
        <ToolbarGroup align={{ default: 'alignEnd' }}>
          <MarketplacePurchasesPagination isCompact />
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};
