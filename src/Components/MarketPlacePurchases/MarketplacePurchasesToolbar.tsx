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
  ToolbarItem
} from '@patternfly/react-core';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
import { MarketplacePurchasesPagination } from './MarketplacePurchasesPagination';
import { MarketplacePurchasesTextFilter } from './MarketplacePurchasesTextFilter';
import { MarketplacePurchasesFilterList } from './MarketplacePurchasesFilterList';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { MarketplacePurchasesFilterCategoryData } from '../../state/marketplacePurchases';

type FilterCategory = 'OfferingName' | 'MarketplaceAccount' | 'Marketplace';

const FILTER_LABELS: Record<FilterCategory, string> = {
  OfferingName: 'Offering name',
  MarketplaceAccount: 'Marketplace account',
  Marketplace: 'Marketplace'
};

export const MarketplacePurchasesToolbar = () => {
  const [activeCategory, setActiveCategory] = useQueryParamInformedAtom(
    MarketplacePurchasesFilterCategoryData,
    'filterCategory'
  );

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const onCategorySelect = (
    _event: React.MouseEvent | undefined,
    value: string | number | undefined
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
    <Toolbar id="marketplace-purchases-toolbar">
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
                {(Object.keys(FILTER_LABELS) as FilterCategory[]).map((category) => (
                  <SelectOption key={category} value={category}>
                    {FILTER_LABELS[category]}
                  </SelectOption>
                ))}
              </SelectList>
            </Select>
          </ToolbarItem>
          <MarketplacePurchasesTextFilter activeCategory={activeCategory} />
        </ToolbarGroup>
        <ToolbarGroup align={{ default: 'alignEnd' }}>
          <MarketplacePurchasesPagination isCompact />
        </ToolbarGroup>
      </ToolbarContent>
      <MarketplacePurchasesFilterList />
    </Toolbar>
  );
};
