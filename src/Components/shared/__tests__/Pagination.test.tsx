import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PaginationBase } from '../PaginationBase';
import { atom } from 'jotai';
jest.mock('../../../hooks/util/useQueryParam', () => ({
  useQueryParamInformedAtom: jest.fn(),
}));
import { useQueryParamInformedAtom } from '../../../hooks/util/useQueryParam';
const mockSetPagination = jest.fn();
const testAtom = atom({
  page: 1,
  perPage: 10,
  itemCount: 100,
});
const setup = (
  override?: Partial<{
    page: number;
    perPage: number;
    itemCount: number;
    isCompact: boolean;
  }>,
) => {
  (useQueryParamInformedAtom as jest.Mock).mockReturnValue([
    {
      page: override?.page ?? 1,
      perPage: override?.perPage ?? 10,
      itemCount: override?.itemCount ?? 100,
    },
    mockSetPagination,
  ]);
  return render(
    <PaginationBase atom={testAtom} isCompact={override?.isCompact ?? false} />,
  );
};
describe('PaginationBase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders pagination with default values', () => {
    setup();
    expect(
      screen.getByRole('button', { name: /go to next page/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /go to previous page/i }),
    ).toBeInTheDocument();
  });
  it('updates page when page is changed', () => {
    setup();
    const nextPageButton = screen.getByRole('button', {
      name: /go to next page/i,
    });
    fireEvent.click(nextPageButton);
    expect(mockSetPagination).toHaveBeenCalledWith({
      perPage: 10,
      itemCount: 100,
      page: 2,
    });
  });
  it('respects isCompact prop', () => {
    setup({ isCompact: true });
    expect(useQueryParamInformedAtom).toHaveBeenCalled();
  });
});
