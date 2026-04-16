import React from 'react';
import { Button, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { useClearCloudAccountFilters } from '../util/useClearCloudAccountFilters';

export const NoSearchResults = () => {
  const clearFilters = useClearCloudAccountFilters();

  return (
    <EmptyState>
      <EmptyStateBody>
        No results found. Try adjusting your filters.       
      </EmptyStateBody>
      <Button variant="link" onClick={clearFilters} isInline>
        Clear all filters       
      </Button>
    </EmptyState>
  );
};
