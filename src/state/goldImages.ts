import { atom } from 'jotai';
import { CloudProviderName } from '../hooks/api/useGoldImages';
import { PaginationData } from '../types/pagination';

export const goldImagePaginationData = atom<PaginationData>({
  page: 1,
  perPage: 10,
  itemCount: 0,
});

export const cloudProviderFilterData = atom<CloudProviderName[]>([]);
