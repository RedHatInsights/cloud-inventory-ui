import React, { FunctionComponent } from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  Title,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';

interface NoSearchResultsProps {
  clearFilters: () => void;
}

const NoSearchResults: FunctionComponent<NoSearchResultsProps> = ({
  clearFilters,
}) => {
  return (
    <EmptyState icon={SearchIcon}>
      <Title headingLevel="h2" size="lg">
        No results found       
      </Title>
      <EmptyStateBody>
        No results match the filter criteria. Remove individual filters or
        clear all filters to show results.       
      </EmptyStateBody>
      <EmptyStateFooter>
        <Button variant="link" onClick={clearFilters}>
          Clear all filters         
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default NoSearchResults;
