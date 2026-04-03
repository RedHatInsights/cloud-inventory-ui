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
    setSearchValue(accountIDFilter || '');
  }, [accountIDFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== accountIDFilter) {
        setAccountIDFilter(searchValue);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue, accountIDFilter, setAccountIDFilter]);

  return (
    <ToolbarItem>
      <SearchInput
        placeholder="Filter by account ID"
        value={searchValue}
        onChange={(_event, value) => setSearchValue(value)}
        onClear={() => {
          setSearchValue('');
          setAccountIDFilter('');
        }}
      />
    </ToolbarItem>
  );
};
