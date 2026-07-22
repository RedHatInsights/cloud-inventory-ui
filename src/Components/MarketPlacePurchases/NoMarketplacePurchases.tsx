import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import React from 'react';

export const NoMarketplacePurchases = () => (
  <EmptyState
    variant="lg"
    titleText="No Marketplace Purchases Available"
    headingLevel="h4"
    icon={CubesIcon}
  >
    <EmptyStateBody>You have no Marketplace Purchases.</EmptyStateBody>
  </EmptyState>
);
