import { atom } from 'jotai';
import { PaginationData } from '../types/pagination';
import { CloudProviderShortname } from '../hooks/api/useCloudAccounts';

export const cloudProviderFilterData = atom<CloudProviderShortname[]>([]);

export const goldImageStatusFilterData = atom<string[]>([]);

export const cloudAccountIDFilterData = atom<string>('');

export const CloudAccountsPaginationData = atom<PaginationData>({
  page: 1,
  perPage: 10,
  itemCount: 0,
});

export type CloudAccountsSortField =
  | 'providerAccountID'
  | 'provider'
  | 'goldImageAccess'
  | 'dateAdded';

export const cloudAccountsFilterCategoryData = atom<
  'ID' | 'Provider' | 'Status'
>('ID');
