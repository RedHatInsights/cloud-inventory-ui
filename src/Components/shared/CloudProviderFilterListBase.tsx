import React from 'react';
import { Button, Label, LabelGroup } from '@patternfly/react-core';
import { PrimitiveAtom } from 'jotai';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';

interface CloudProviderFilterListBaseProps {
  atom: PrimitiveAtom<string[]>;
}

export const CloudProviderFilterListBase = ({
  atom,
}: CloudProviderFilterListBaseProps) => {
  const [cloudProviderFilter, setCloudProviderFilter] =
    useQueryParamInformedAtom<string[]>(atom, 'cloudProvider') as [
      string[],
      (value: string[] | ((prev: string[]) => string[])) => void
    ];

  return (
    <LabelGroup categoryName="Cloud provider">
      {cloudProviderFilter.map((cloudProvider: string) => (
        <Label
          key={cloudProvider}
          onClose={() =>
            setCloudProviderFilter((existing) =>
              existing.filter((c) => c !== cloudProvider)
            )
          }
        >
          {cloudProvider}
        </Label>
      ))}

      {cloudProviderFilter.length > 0 && (
        <Button variant="link" onClick={() => setCloudProviderFilter([])}>
          Clear filters
        </Button>
      )}
    </LabelGroup>
  );
};
