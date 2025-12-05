import {
  InputGroup,
  InputGroupItem,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectGroup,
  SelectList,
  SelectOption,
  TextInput,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { useSetAtom } from 'jotai';

import React, { Ref, useState } from 'react';
import {
  cloudAccountsAccountFilterData,
  cloudAccountsGoldImageFilterData,
  cloudAccountsProviderFilterData,
} from '../../state/cloudAccounts';

export type CloudAccountFilterType =
  | 'cloudAccount'
  | 'cloudProvider'
  | 'autoRegistration'
  | 'goldImageAccess';

const FILTER_LABELS: Record<CloudAccountFilterType, string> = {
  cloudAccount: 'Cloud account',
  cloudProvider: 'Cloud provider',
  autoRegistration: 'Auto-registration',
  goldImageAccess: 'Gold image access',
};

export const CloudAccountsFilterSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] =
    useState<CloudAccountFilterType>('cloudAccount');
  const [searchValue, setSearchValue] = useState('');
  const setCloudAccountFilter = useSetAtom(cloudAccountsAccountFilterData);
  const setCloudProviderFilter = useSetAtom(cloudAccountsProviderFilterData);
  const setGoldImageFilter = useSetAtom(cloudAccountsGoldImageFilterData);

  const currentLabel = FILTER_LABELS[filterType];
  return (
    <InputGroup className="pf-v6-u-w-100">
      <InputGroupItem>
        <Select
          isOpen={isOpen}
          selected={filterType}
          onSelect={(_event, value) => {
            setFilterType(value as CloudAccountFilterType);
            setIsOpen(false);
            setSearchValue('');
            setCloudAccountFilter([]);
            setCloudProviderFilter([]);
            setGoldImageFilter([]);
          }}
          onOpenChange={setIsOpen}
          toggle={(toggleRef: Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              icon={<FilterIcon />}
              onClick={() => setIsOpen((prev) => !prev)}
              isExpanded={isOpen}
            >
              {currentLabel}
            </MenuToggle>
          )}
        >
          <SelectGroup>
            <SelectList>
              <SelectOption value="cloudAccount">Cloud account</SelectOption>
              <SelectOption value="cloudProvider">Cloud provider</SelectOption>
              <SelectOption value="autoRegistration">
                Auto-registration
              </SelectOption>
              <SelectOption value="goldImageAccess">
                Gold image access
              </SelectOption>
            </SelectList>
          </SelectGroup>
        </Select>
      </InputGroupItem>
      <InputGroupItem isFill>
        <TextInput
          className="pf-v6-u-w-50"
          value={searchValue}
          type="search"
          onChange={(_, value) => {
            setSearchValue(value);

            if (filterType === 'cloudAccount') {
              setCloudAccountFilter(value ? [value] : []);
            }

            if (filterType === 'cloudProvider') {
              setCloudProviderFilter(value ? [value] : []);
            }

            if (filterType === 'goldImageAccess') {
              setGoldImageFilter(value ? [value] : []);
            }
          }}
          placeholder={`Filter by ${currentLabel.toLowerCase()}`}
          aria-label="Cloud accounts filter search"
        />
      </InputGroupItem>
    </InputGroup>
  );
};
