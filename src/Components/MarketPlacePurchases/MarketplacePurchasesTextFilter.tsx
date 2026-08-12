import React, { useEffect, useRef, useState } from 'react';
import { SearchInput, ToolbarItem } from '@patternfly/react-core';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import {
  MarketplaceAccountFilterData,
  MarketplaceFilterData,
  MarketplaceOfferingNameFilterData
} from '../../state/marketplacePurchases';

export type MarketplaceFilterCategory = 'OfferingName' | 'MarketplaceAccount' | 'Marketplace';

export const FILTER_LABELS: Record<MarketplaceFilterCategory, string> = {
  OfferingName: 'Offering name',
  MarketplaceAccount: 'Marketplace account',
  Marketplace: 'Marketplace'
};

type MarketplacePurchasesTextFilterProps = {
  activeCategory: MarketplaceFilterCategory;
};

export const MarketplacePurchasesTextFilter = ({
  activeCategory
}: MarketplacePurchasesTextFilterProps) => {
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

  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [inputValue, setInputValue] = useState('');

  const activeValue =
    activeCategory === 'OfferingName'
      ? offeringName
      : activeCategory === 'MarketplaceAccount'
        ? marketplaceAccount
        : marketplace;

  useEffect(() => {
    setInputValue(activeValue || '');
  }, [activeCategory, activeValue]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const applyFilter = (value: string) => {
    switch (activeCategory) {
      case 'OfferingName':
        setOfferingName(value);
        break;

      case 'MarketplaceAccount':
        setMarketplaceAccount(value);
        break;

      case 'Marketplace':
        setMarketplace(value);
        break;
    }
  };

  const handleChange = (_event: unknown, value: string) => {
    setInputValue(value);

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      applyFilter(value);
    }, 400);
  };

  const handleClear = () => {
    clearTimeout(timerRef.current);
    setInputValue('');
    applyFilter('');
  };

  return (
    <ToolbarItem>
      <SearchInput
        aria-label={`Filter by ${FILTER_LABELS[activeCategory]}`}
        placeholder={`Filter by ${FILTER_LABELS[activeCategory].toLowerCase()}`}
        value={inputValue}
        onChange={handleChange}
        onClear={handleClear}
      />
    </ToolbarItem>
  );
};
