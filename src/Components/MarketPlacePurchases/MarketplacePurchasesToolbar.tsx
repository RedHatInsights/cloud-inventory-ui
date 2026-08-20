import React from 'react';
import { Toolbar, ToolbarContent, ToolbarGroup } from '@patternfly/react-core';
import { MarketplacePurchasesPagination } from './MarketplacePurchasesPagination';
import { MarketplacePurchasesFilterList } from './MarketplacePurchasesFilterList';
import { MarketplacePurchasesFilter } from './MarketplacePurchasesFilter';

export const MarketplacePurchasesToolbar = () => {
  return (
    <Toolbar id="marketplace-purchases-toolbar">
      <ToolbarContent>
        <MarketplacePurchasesFilter />
        <ToolbarGroup align={{ default: 'alignEnd' }}>
          <MarketplacePurchasesPagination isCompact />
        </ToolbarGroup>
      </ToolbarContent>
      <MarketplacePurchasesFilterList />
    </Toolbar>
  );
};
