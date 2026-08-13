import React from 'react';
import { Button, EmptyState, EmptyStateBody } from '@patternfly/react-core';

interface NoSearchResultsProps {
  onClearFilters: () => void;
}

export const NoSearchResults = ({ onClearFilters }: NoSearchResultsProps) => {
  return (
    <EmptyState>
      <EmptyStateBody>No results found. Try adjusting your filters.</EmptyStateBody>
      <Button variant="link" onClick={onClearFilters} isInline>
        Clear all filters
      </Button>
    </EmptyState>
  );
};
