import React, { Ref, useState } from 'react';
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption
} from '@patternfly/react-core';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { MarketplaceFilterData } from '../../state/marketplacePurchases';
import { marketplaceToFriendly } from '../../hooks/util/cloudProviderMaps';

const availableMarketplaces = ['aws_marketplace', 'azure_marketplace'];

export const MarketplacePurchasesMarketplaceFilter = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedMarketplaces, setSelectedMarketplaces] = useQueryParamInformedAtom(
    MarketplaceFilterData,
    'marketplace'
  );

  const onSelect = (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
    if (!value || typeof value !== 'string') {
      return;
    }

    if (!selectedMarketplaces.includes(value)) {
      setSelectedMarketplaces([...selectedMarketplaces, value]);
    }

    setIsOpen(false);
  };

  return (
    <Select
      role="menu"
      isOpen={isOpen}
      selected={selectedMarketplaces}
      onSelect={onSelect}
      onOpenChange={setIsOpen}
      toggle={(toggleRef: Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          onClick={() => setIsOpen((prev) => !prev)}
          isExpanded={isOpen}
          {...(selectedMarketplaces.length > 0 && {
            badge: selectedMarketplaces.length
          })}
        >
          {selectedMarketplaces.length === 0 ? 'Filter by marketplace' : 'Marketplace'}
        </MenuToggle>
      )}
    >
      <SelectList>
        {availableMarketplaces.map((value) => (
          <SelectOption key={value} itemId={value} value={value}>
            {marketplaceToFriendly[value] ?? value}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};
