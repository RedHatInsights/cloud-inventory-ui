import React, { useState } from 'react';
import {
  Button,
  Label,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
import { CloudAccountIDFilter } from './CloudAccountIDFilter';
import { CloudAccountsPagination } from './CloudAccountsPagination';
import { CloudProviderSharedFilterList } from '../shared/CloudProviderSharedFilterList';
import { CloudProviderSharedFilterSelect } from '../shared/CloudProviderSharedFilterSelect';
import {
  cloudAccountIDFilterData,
  cloudProviderFilterData,
  goldImageStatusFilterData,
} from '../../state/cloudAccounts';
import {
  CloudProviderShortname,
  ProviderLabelMap,
} from '../../hooks/api/useCloudAccounts';
import { GoldImageAccessFilter } from './GoldImageAccessFilter';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';

interface CloudAccountsToolbarProps {
  onClearAll: () => void;
  availableProviders: CloudProviderShortname[];
  availableStatuses: string[];
}

type FilterCategory = 'ID' | 'Provider' | 'Status';

export const CloudAccountsToolbar: React.FC<CloudAccountsToolbarProps> = ({
  onClearAll,
  availableProviders,
  availableStatuses,
}) => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('ID');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [selectedProviders, setSelectedProviders] = useQueryParamInformedAtom(
    cloudProviderFilterData,
    'shortName',
  );
  const [selectedStatuses, setSelectedStatuses] = useQueryParamInformedAtom(
    goldImageStatusFilterData,
    'goldImageAccess',
  );
  const [selectedID, setSelectedID] = useQueryParamInformedAtom(
    cloudAccountIDFilterData,
    'providerAccountID',
  );

  const onCategorySelect = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _event: any,
    value: string | number | undefined,
  ) => {
    setActiveCategory(value as FilterCategory);
    setIsCategoryDropdownOpen(false);
  };

  const categoryToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
      isExpanded={isCategoryDropdownOpen}
      icon={<FilterIcon />}
    >
      {activeCategory === 'ID' && 'Cloud account'}
      {activeCategory === 'Provider' && 'Cloud provider'}
      {activeCategory === 'Status' && 'Gold image access'}
    </MenuToggle>
  );

  const onDeleteGroup = (category: string) => {
    if (category === 'Cloud provider') setSelectedProviders([]);
    if (category === 'Cloud account') setSelectedID('');
    if (category === 'Gold image access') setSelectedStatuses([]);
  };

  const hasActiveFilters =
    !!selectedID || selectedProviders.length > 0 || selectedStatuses.length > 0;

  return (
    <Toolbar
      id="cloud-accounts-toolbar"
      clearAllFilters={onClearAll}
      clearFiltersButtonText={
        hasActiveFilters ? 'Clear all filters' : undefined
      }
    >
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          <ToolbarItem>
            <Select
              role="menu"
              onSelect={onCategorySelect}
              isOpen={isCategoryDropdownOpen}
              onOpenChange={(isOpen) => setIsCategoryDropdownOpen(isOpen)}
              toggle={categoryToggle}
            >
              <SelectList>
                <SelectOption value="ID">Cloud account</SelectOption>
                <SelectOption value="Provider">Cloud provider</SelectOption>
                <SelectOption value="Status">Gold image access</SelectOption>
              </SelectList>
            </Select>
          </ToolbarItem>
          <ToolbarItem>
            {activeCategory === 'ID' && <CloudAccountIDFilter />}
            {activeCategory === 'Provider' && (
              <CloudProviderSharedFilterSelect
                filterAtom={cloudProviderFilterData}
                queryParamKey="shortName"
                selectOptions={availableProviders}
                labelMap={ProviderLabelMap}
                isSplitButton={false}
              />
            )}
            {activeCategory === 'Status' && (
              <GoldImageAccessFilter availableStatuses={availableStatuses} />
            )}
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup align={{ default: 'alignEnd' }}>
          <CloudAccountsPagination isCompact />
        </ToolbarGroup>
      </ToolbarContent>
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
          <ToolbarFilter
            categoryName="Cloud account"
            labels={[]}
            deleteLabelGroup={() => onDeleteGroup('Cloud account')}
          >
            {selectedID ? (
              <Label onClose={() => setSelectedID('')}>{selectedID}</Label>
            ) : (
              <React.Fragment />
            )}
          </ToolbarFilter>
          <ToolbarFilter
            categoryName="Cloud provider"
            labels={[]}
            deleteLabelGroup={() => onDeleteGroup('Cloud provider')}
          >
            <CloudProviderSharedFilterList
              filterAtom={cloudProviderFilterData}
              queryParamKey="shortName"
              labelMap={ProviderLabelMap}
            />
          </ToolbarFilter>
          <ToolbarFilter
            categoryName="Gold image access"
            labels={[]}
            deleteLabelGroup={() => onDeleteGroup('Gold image access')}
          >
            <CloudProviderSharedFilterList
              filterAtom={goldImageStatusFilterData}
              queryParamKey="goldImageAccess"
            />
          </ToolbarFilter>
        </ToolbarGroup>
        {hasActiveFilters && (
          <ToolbarGroup>
            <ToolbarItem>
              <Button variant="link" onClick={onClearAll} isInline>
                Clear all filters
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        )}
      </ToolbarContent>
    </Toolbar>
  );
};

export default CloudAccountsToolbar;
