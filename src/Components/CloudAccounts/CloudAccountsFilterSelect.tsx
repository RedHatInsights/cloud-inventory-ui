import {
  MenuToggle,
  MenuToggleAction,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';
import React, { Ref, useState } from 'react';

export const CloudAccountsFilterSelect = () => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [cloudAccountsFilter, setCloudAccountsFilter] = useState<string[]>([]);

  const cloudProviders = [
    'AWS',
    'Azure',
    'Google Cloud',
    'IBM Cloud',
    'Oracle Cloud',
  ];

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
      selected={cloudAccountsFilter}
      onSelect={(_event, value) => {
        if (!cloudAccountsFilter.includes(value as string)) {
          setCloudAccountsFilter([...cloudAccountsFilter, value as string]);
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
