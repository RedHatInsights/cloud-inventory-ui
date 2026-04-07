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

const FILTER_CONFIG: Record<
  FilterCategory,
  {
    selectLabel: string;
    toolbarCategoryName: string;
  }
> = {
  ID: {
    selectLabel: 'Cloud account',
    toolbarCategoryName: 'Cloud account',
  },
  Provider: {
    selectLabel: 'Cloud provider',
    toolbarCategoryName: 'Cloud provider',
  },
  Status: {
    selectLabel: 'Gold image access',
    toolbarCategoryName: 'Gold image access',
  },
};

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
            {FILTER_CONFIG[activeCategory].selectLabel}
          
    </MenuToggle>
  );

  const clearHandlers: Record<FilterCategory, () => void> = {
    ID: () => setSelectedID(''),
    Provider: () => setSelectedProviders([]),
    Status: () => setSelectedStatuses([]),
  };

  const onDeleteGroup = (category: FilterCategory) => {
    clearHandlers[category]();
  };

  const hasActiveFilters =
    Boolean(selectedID) ||
    selectedProviders.length > 0 ||
    selectedStatuses.length > 0;

  return (
    <Toolbar id="cloud-accounts-toolbar">
      <ToolbarContent>
        <ToolbarGroup variant="filter-group">
                    
          <ToolbarItem>
            {' '}
            <Select
              role="menu"
              onSelect={onCategorySelect}
              isOpen={isCategoryDropdownOpen}
              onOpenChange={setIsCategoryDropdownOpen}
              toggle={categoryToggle}
            >
              <SelectList>
                {(Object.keys(FILTER_CONFIG) as FilterCategory[]).map((key) => (
                  <SelectOption key={key} value={key}>
                    {FILTER_CONFIG[key].selectLabel}
                  </SelectOption>
                ))}
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
                toggleLabel="Filter by cloud provider"
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
            categoryName={FILTER_CONFIG.ID.toolbarCategoryName}
            labels={[]}
            deleteLabelGroup={() => onDeleteGroup('ID')}
          >
            {selectedID ? (
              <Label onClose={() => setSelectedID('')}>{selectedID}</Label>
            ) : (
              <React.Fragment />
            )}
          </ToolbarFilter>
          <ToolbarFilter
            categoryName={FILTER_CONFIG.Provider.toolbarCategoryName}
            labels={[]}
            deleteLabelGroup={() => onDeleteGroup('Provider')}
          >
            <CloudProviderSharedFilterList
              filterAtom={cloudProviderFilterData}
              queryParamKey="shortName"
              labelMap={ProviderLabelMap}
            />
          </ToolbarFilter>
          <ToolbarFilter
            categoryName={FILTER_CONFIG.Status.toolbarCategoryName}
            labels={[]}
            deleteLabelGroup={() => onDeleteGroup('Status')}
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
