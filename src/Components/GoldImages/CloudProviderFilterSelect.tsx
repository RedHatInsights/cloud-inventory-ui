import {
  MenuToggle,
  MenuToggleAction,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';
import { useAtom } from 'jotai';
import React, { Ref, useState } from 'react';
import { cloudProviderFilterData } from '../../state/goldImages';

interface CloudProviderFilterSelectProps {
  cloudProviders: string[];
}

export const CloudProviderFilterSelect = ({
  cloudProviders,
}: CloudProviderFilterSelectProps) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [cloudProviderFilter, setCloudProviderFilter] = useAtom(
    cloudProviderFilterData
  );

  return (
    <Select
      isOpen={isFilterExpanded}
      toggle={(toggleRef: Ref<MenuToggleElement>) => {
        return (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            isExpanded={isFilterExpanded}
            splitButtonItems={[
              <MenuToggleAction
                key="label"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              >
                Cloud Provider
              </MenuToggleAction>,
            ]}
          >
            {'Filter by cloud provider'}
          </MenuToggle>
        );
      }}
      selected={cloudProviderFilter}
      onSelect={(_event, value) => {
        if (!cloudProviderFilter.includes(value as string)) {
          setCloudProviderFilter([...cloudProviderFilter, value as string]);
        }
        setIsFilterExpanded(false);
      }}
      onOpenChange={(isOpen) => setIsFilterExpanded(isOpen)}
    >
      <SelectList>
        {cloudProviders.map((cloudProvider) => (
          <SelectOption key={cloudProvider} value={cloudProvider}>
            {cloudProvider}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};
