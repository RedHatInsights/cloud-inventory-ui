import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  Title,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import {
  CloudAccountsPaginationData,
  cloudAccountIDFilterData,
  cloudProviderFilterData,
  goldImageStatusFilterData,
} from '../../state/cloudAccounts';

const useClearCloudAccountFilters = () => {
  const [pagination, setPagination] = useQueryParamInformedAtom(
    CloudAccountsPaginationData,
    'pagination',
  );
  const [, setProviders] = useQueryParamInformedAtom(
    cloudProviderFilterData,
    'shortName',
  );
  const [, setStatuses] = useQueryParamInformedAtom(
    goldImageStatusFilterData,
    'goldImageAccess',
  );
  const [, setAccountID] = useQueryParamInformedAtom(
    cloudAccountIDFilterData,
    'providerAccountID',
  );

  return () => {
    setProviders([]);
    setStatuses([]);
    setAccountID('');
    setPagination({ ...pagination, page: 1 });
  };
};

const NoSearchResults = () => {
  const clearFilters = useClearCloudAccountFilters();

  return (
    <EmptyState icon={SearchIcon}>
            
      <Title headingLevel="h2" size="lg">
        No results found       
      </Title>
      <EmptyStateBody>
        No results match the filter criteria. Remove individual filters or clear
        all filters to show results.       
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
