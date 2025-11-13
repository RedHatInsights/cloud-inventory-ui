import { atom } from 'jotai';

interface CloudAccountsPaginationData {
  page: number;
  perPage: number;
  itemCount: number;
}

export const cloudAccountsPaginationData = atom<CloudAccountsPaginationData>({
  page: 1,
  perPage: 10,
  itemCount: 0,
});

export const cloudAccountsFilterData = atom<string[]>([]);
