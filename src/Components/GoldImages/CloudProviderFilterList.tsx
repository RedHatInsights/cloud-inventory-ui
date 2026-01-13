import { Button, Label, LabelGroup } from '@patternfly/react-core';
import React from 'react';
import { cloudProviderFilterData } from '../../state/goldImages';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { CloudProviderName } from '../../hooks/api/useGoldImages';

export const CloudProviderFilterList = () => {
  const [cloudProviderFilter, setCloudProviderFilter] =
    useQueryParamInformedAtom<CloudProviderName[]>(
      cloudProviderFilterData,
      'cloudProvider',
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
                  (existing) => cloudProvider != existing,
                ),
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
