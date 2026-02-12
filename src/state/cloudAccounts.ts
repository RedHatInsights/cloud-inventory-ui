import { atom } from 'jotai';
import { PaginationData } from '../types/pagination';

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
