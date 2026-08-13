import React from 'react';
import {
  Button,
  Label,
  LabelGroup,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import {
  MarketplaceAccountFilterData,
  MarketplaceFilterData,
  MarketplaceOfferingNameFilterData
} from '../../state/marketplacePurchases';
import { marketplaceToFriendly } from '../../hooks/util/cloudProviderMaps';

export const MarketplacePurchasesFilterList = () => {
  const [offeringName, setOfferingName] = useQueryParamInformedAtom(
    MarketplaceOfferingNameFilterData,
    'offeringName'
  );

  const [marketplaceAccount, setMarketplaceAccount] = useQueryParamInformedAtom(
    MarketplaceAccountFilterData,
    'marketplaceAccount'
  );

  const [selectedMarketplaces, setSelectedMarketplaces] = useQueryParamInformedAtom(
    MarketplaceFilterData,
    'marketplace'
  );

  const hasActiveFilters =
    offeringName !== '' || marketplaceAccount !== '' || selectedMarketplaces.length > 0;

  const clearFilters = () => {
    setOfferingName('');
    setMarketplaceAccount('');
    setSelectedMarketplaces([]);
  };

  return (
    <ToolbarContent>
      <ToolbarGroup variant="filter-group">
        {offeringName && (
          <LabelGroup categoryName="Offering name">
            <Label onClose={() => setOfferingName('')}>{offeringName}</Label>
          </LabelGroup>
        )}
        {marketplaceAccount && (
          <LabelGroup categoryName="Marketplace account">
            <Label onClose={() => setMarketplaceAccount('')}>{marketplaceAccount}</Label>
          </LabelGroup>
        )}
        {selectedMarketplaces.length > 0 && (
          <LabelGroup categoryName="Marketplace">
            {selectedMarketplaces.map((marketplace) => (
              <Label
                key={marketplace}
                onClose={() =>
                  setSelectedMarketplaces(
                    selectedMarketplaces.filter((selected) => selected !== marketplace)
                  )
                }
              >
                {marketplaceToFriendly[marketplace] ?? marketplace}
              </Label>
            ))}
          </LabelGroup>
        )}
      </ToolbarGroup>
      {hasActiveFilters && (
        <ToolbarGroup>
          <ToolbarItem>
            <Button variant="link" onClick={clearFilters} isInline>
              Clear all filters
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
      )}
    </ToolbarContent>
  );
};
