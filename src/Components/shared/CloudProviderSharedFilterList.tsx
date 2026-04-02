import { Label } from '@patternfly/react-core';
import React from 'react';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { PrimitiveAtom } from 'jotai';

interface CloudProviderSharedFilterListProps<T extends string> {
  filterAtom: PrimitiveAtom<T[]>;
  queryParamKey: string;
  labelMap?: Record<string, string>;
}

export const CloudProviderSharedFilterList = <T extends string>({
  filterAtom,
  queryParamKey,
  labelMap,
}: CloudProviderSharedFilterListProps<T>) => {
  const [filters, setFilters] = useQueryParamInformedAtom<T[]>(
    filterAtom,
    queryParamKey,
  );

  if (filters.length === 0) return null;

  return (
    <>
      {filters.map((val) => (
        <Label
          key={val as string}
          onClose={() => setFilters(filters.filter((f) => f !== val))}
        >
          {labelMap ? labelMap[val as string] : (val as string)}
        </Label>
      ))}
    </>
  );
};
