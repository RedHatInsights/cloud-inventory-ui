import React, { useState } from 'react';
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
import { CloudAccountIDFilter } from './CloudAccountIDFilter';
import { CloudAccountsPagination } from './CloudAccountsPagination';
import { cloudAccountsFilterCategoryData } from '../../state/cloudAccounts';
import { GoldImageAccessFilter } from './GoldImageAccessFilter';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { CloudProviderShortname } from '../../types/cloudAccountsTypes';
import { CloudAccountProviderFilter } from './CloudAccountProviderFilter';
import { CloudAccountsFilterList } from './CloudAccountsFilterList';

interface CloudAccountsToolbarProps {
  availableProviders: CloudProviderShortname[];
  availableStatuses: string[];
}

type FilterCategory = 'ID' | 'Provider' | 'Status';

const FILTER_LABELS: Record<FilterCategory, string> = {
  ID: 'Cloud account',
  Provider: 'Cloud provider',
  Status: 'Gold image access',
};

export const CloudAccountsToolbar: React.FC<CloudAccountsToolbarProps> = ({
  availableProviders,
  availableStatuses,
}) => {
  const [activeCategory, setActiveCategory] = useQueryParamInformedAtom(
    cloudAccountsFilterCategoryData,
    'filterCategory',
  );
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const onCategorySelect = (
    _event: React.MouseEvent | undefined,
    value: string | number | undefined,
  ) => {
    if (!value) {
      return;
    }

    setActiveCategory(value as FilterCategory);
    setIsCategoryDropdownOpen(false);
  };

  const categoryToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
      isExpanded={isCategoryDropdownOpen}
      icon={<FilterIcon />}
    >
            {FILTER_LABELS[activeCategory]}
          
    </MenuToggle>
  );

  return (
    <Toolbar id="cloud-accounts-toolbar">
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          <ToolbarItem>
            <Select
              role="menu"
              onSelect={onCategorySelect}
              isOpen={isCategoryDropdownOpen}
              onOpenChange={setIsCategoryDropdownOpen}
              toggle={categoryToggle}
            >
              <SelectList>
                {(Object.keys(FILTER_LABELS) as FilterCategory[]).map(
                  (category) => (
                    <SelectOption key={category} value={category}>
                      {FILTER_LABELS[category]}
                    </SelectOption>
                  ),
                )}
              </SelectList>
            </Select>
          </ToolbarItem>
          {activeCategory === 'ID' && <CloudAccountIDFilter />}
          {activeCategory === 'Provider' && (
            <CloudAccountProviderFilter
              availableProviders={availableProviders}
            />
          )}
          {activeCategory === 'Status' && (
            <ToolbarItem>
              <GoldImageAccessFilter availableStatuses={availableStatuses} />
            </ToolbarItem>
          )}
        </ToolbarGroup>
        <ToolbarGroup align={{ default: 'alignEnd' }}>
          <CloudAccountsPagination isCompact />
        </ToolbarGroup>
      </ToolbarContent>
      <CloudAccountsFilterList />
    </Toolbar>
  );
};
