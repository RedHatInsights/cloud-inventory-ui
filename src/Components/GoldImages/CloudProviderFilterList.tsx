import { Button, Label, LabelGroup } from '@patternfly/react-core';
import React from 'react';
import { cloudProviderFilterData } from '../../state/goldImages';
import { useAtom } from 'jotai';

export const CloudProviderFilterList = () => {
  const [cloudProviderFilter, setCloudProviderFilter] = useAtom(
    cloudProviderFilterData
  );

  return (
    <>
      <LabelGroup categoryName="Cloud provider">
        {cloudProviderFilter.map((cloudProvider) => (
          <Label
            key={cloudProvider}
            onClose={() => {
              setCloudProviderFilter(
                cloudProviderFilter.filter(
                  (existing) => cloudProvider != existing
                )
              );
            }}
          >
            {cloudProvider}
          </Label>
        ))}
      </LabelGroup>
      {cloudProviderFilter.length != 0 && (
        <Button variant="link" onClick={() => setCloudProviderFilter([])}>
          Clear filters
        </Button>
      )}
    </>
  );
};
