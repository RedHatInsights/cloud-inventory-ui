import { atom } from 'jotai';
import { PaginationData } from '../types/pagination';
import { SortByDirection } from '@patternfly/react-table';
import { MarketplacePurchaseSortField } from '../hooks/api/useMarketplacePurchases';

export const MarketplacePurchasesPaginationData = atom<PaginationData>({
  page: 1,
  perPage: 10,
  itemCount: 0
});

export const MarketplacePurchasesFilterCategoryData = atom<
  'OfferingName' | 'MarketplaceAccount' | 'Marketplace'
>('OfferingName');

export const MarketplaceOfferingNameFilterData = atom<string>('');

export const MarketplaceAccountFilterData = atom<string>('');

export const MarketplaceFilterData = atom<string[]>([]);

export const MarketplacePurchasesSortByData = atom<MarketplacePurchaseSortField | undefined>(
  undefined
);

export const MarketplacePurchasesSortDirData = atom<SortByDirection | undefined>(undefined);
