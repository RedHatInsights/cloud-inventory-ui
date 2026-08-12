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

export const MarketplacePurchasesFilterList = () => {
  const [offeringName, setOfferingName] = useQueryParamInformedAtom(
    MarketplaceOfferingNameFilterData,
    'offeringName'
  );

  const [marketplaceAccount, setMarketplaceAccount] = useQueryParamInformedAtom(
    MarketplaceAccountFilterData,
    'marketplaceAccount'
  );

  const [marketplace, setMarketplace] = useQueryParamInformedAtom(
    MarketplaceFilterData,
    'marketplace'
  );

  const hasActiveFilters = offeringName !== '' || marketplaceAccount !== '' || marketplace !== '';

  const clearFilters = () => {
    setOfferingName('');
    setMarketplaceAccount('');
    setMarketplace('');
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
        {marketplace && (
          <LabelGroup categoryName="Marketplace">
            <Label onClose={() => setMarketplace('')}>{marketplace}</Label>
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
