import { atom } from 'jotai';
import { PaginationData } from '../types/pagination';

export const MarketplacePurchasesPaginationData = atom<PaginationData>({
  page: 1,
  perPage: 10,
  itemCount: 0
});
