import React, { useEffect, useState } from 'react';
import { SearchInput, ToolbarItem } from '@patternfly/react-core';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { cloudAccountIDFilterData } from '../../state/cloudAccounts';

export const CloudAccountIDFilter = () => {
  const [accountIDFilter, setAccountIDFilter] = useQueryParamInformedAtom(
    cloudAccountIDFilterData,
    'providerAccountID',
  );
  const [searchValue, setSearchValue] = useState(accountIDFilter || '');

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setAccountIDFilter(searchValue);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [searchValue, setAccountIDFilter]);

  useEffect(() => {
    setSearchValue(accountIDFilter || '');
  }, [accountIDFilter]);

  return (
    <ToolbarItem>
            
      <SearchInput
        aria-label="Filter by cloud account ID"
        placeholder="Filter by cloud account ID"
        value={searchValue}
        onChange={(_, value) => setSearchValue(value)}
        onClear={() => {
          setSearchValue('');
          setAccountIDFilter('');
        }}
      />
          
    </ToolbarItem>
  );
};
