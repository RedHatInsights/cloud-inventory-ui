import { atom } from 'jotai';

interface CloudAccountsPaginationData {
  page: number;
  perPage: number;
  itemCount: number;
}

export const CloudAccountsPaginationData = atom<CloudAccountsPaginationData>({
  page: 1,
  perPage: 10,
  itemCount: 0,
});
