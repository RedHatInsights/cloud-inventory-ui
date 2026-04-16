import React, { useEffect, useRef } from 'react';
import { SearchInput, ToolbarItem } from '@patternfly/react-core';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { cloudAccountIDFilterData } from '../../state/cloudAccounts';

export const CloudAccountIDFilter = () => {
  const [accountIDFilter, setAccountIDFilter] = useQueryParamInformedAtom(
    cloudAccountIDFilterData,
    'providerAccountID',
  );

  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (_: unknown, value: string) => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setAccountIDFilter(value);
    }, 400);
  };

  const handleClear = () => {
    clearTimeout(timerRef.current);
    setAccountIDFilter('');
  };

  return (
    <ToolbarItem>
            
      <SearchInput
        aria-label="Filter by cloud account ID"
        placeholder="Filter by cloud account ID"
        value={accountIDFilter || ''}
        onChange={handleChange}
        onClear={handleClear}
      />
          
    </ToolbarItem>
  );
};
