import React from 'react';
import { PaginationBase } from '../shared/PaginationBase';
import { MarketplacePurchasesPaginationData } from '../../state/marketplacePurchases';

type MarketplacePurchasesPaginationProps = {
  isCompact?: boolean;
};

export const MarketplacePurchasesPagination = ({
  isCompact = false,
}: MarketplacePurchasesPaginationProps) => {
  return (
    <PaginationBase
      atom={MarketplacePurchasesPaginationData}
      isCompact={isCompact}
    />
  );
};
