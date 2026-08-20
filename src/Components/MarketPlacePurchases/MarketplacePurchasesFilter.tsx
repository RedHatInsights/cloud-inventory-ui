import React, { useState } from 'react';
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
import {
  FILTER_LABELS,
  MarketplaceFilterCategory,
  MarketplacePurchasesTextFilter
} from './MarketplacePurchasesTextFilter';
import { MarketplacePurchasesMarketplaceFilter } from './MarketplacePurchasesMarketplaceFilter';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { MarketplacePurchasesFilterCategoryData } from '../../state/marketplacePurchases';

export const MarketplacePurchasesFilter = () => {
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

    setActiveCategory(value as MarketplaceFilterCategory);
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
            {(Object.keys(FILTER_LABELS) as MarketplaceFilterCategory[]).map((category) => (
              <SelectOption key={category} value={category}>
                {FILTER_LABELS[category]}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
      </ToolbarItem>
      {activeCategory === 'Marketplace' ? (
        <MarketplacePurchasesMarketplaceFilter />
      ) : (
        <MarketplacePurchasesTextFilter activeCategory={activeCategory} />
      )}
    </ToolbarGroup>
  );
};
