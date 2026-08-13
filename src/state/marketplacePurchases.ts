import { atom } from 'jotai';
import { PaginationData } from '../types/pagination';

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
