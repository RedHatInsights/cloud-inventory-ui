import React, { useEffect, useRef, useState } from 'react';
import { SearchInput, ToolbarItem } from '@patternfly/react-core';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { cloudAccountIDFilterData } from '../../state/cloudAccounts';
import { useDebouncedState } from '../../hooks/util/useDebouncedState';

export const CloudAccountIDFilter = () => {
  const [accountIDFilter, setAccountIDFilter] = useQueryParamInformedAtom(
    cloudAccountIDFilterData,
    'providerAccountID',
  );

  const [searchValue, setSearchValue] = useState(accountIDFilter || '');
  const [debouncedValue, setDebouncedValue] = useDebouncedState(
    accountIDFilter || '',
    400,
  );

  const previousAccountIDFilter = useRef(accountIDFilter || '');

  useEffect(() => {
    const nextAccountIDFilter = accountIDFilter || '';

    if (previousAccountIDFilter.current !== nextAccountIDFilter) {
      setSearchValue(nextAccountIDFilter);
      previousAccountIDFilter.current = nextAccountIDFilter;
    }
  }, [accountIDFilter]);

  useEffect(() => {
    if (debouncedValue !== accountIDFilter) {
      setAccountIDFilter(debouncedValue);
    }
  }, [debouncedValue, accountIDFilter, setAccountIDFilter]);

  return (
    <ToolbarItem>
            
      <SearchInput
        placeholder="Filter by account ID"
        value={searchValue}
        onChange={(_event, value) => {
          setSearchValue(value);
          setDebouncedValue(value);
        }}
        onClear={() => {
          setSearchValue('');
          setDebouncedValue('');
          setAccountIDFilter('');
          previousAccountIDFilter.current = '';
        }}
      />
          
    </ToolbarItem>
  );
};
