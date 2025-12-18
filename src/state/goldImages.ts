import { atom } from 'jotai';
import { CloudProviderName } from '../hooks/api/useGoldImages';

interface GoldImagePaginationData {
  page: number;
  perPage: number;
  itemCount: number;
}

export const goldImagePaginationData = atom<GoldImagePaginationData>({
  page: 1,
  perPage: 10,
  itemCount: 0,
});

export const cloudProviderFilterData = atom<CloudProviderName[]>([]);
