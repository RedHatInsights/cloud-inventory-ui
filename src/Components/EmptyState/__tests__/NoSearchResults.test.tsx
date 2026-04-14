import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import NoSearchResults from '../NoSearchResults';
import { useQueryParamInformedAtom } from '../../../hooks/util/useQueryParam';

jest.mock('../../../hooks/util/useQueryParam', () => ({
  useQueryParamInformedAtom: jest.fn(),
}));

const mockUseQueryParamInformedAtom =
  useQueryParamInformedAtom as jest.MockedFunction<
    typeof useQueryParamInformedAtom
  >;

describe('NoSearchResults', () => {
  const setPagination = jest.fn();
  const setProviders = jest.fn();
  const setStatuses = jest.fn();
  const setAccountID = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseQueryParamInformedAtom
      .mockReturnValueOnce([
        { page: 3, perPage: 10, itemCount: 25 },
        setPagination,
      ])
      .mockReturnValueOnce([[], setProviders])
      .mockReturnValueOnce([[], setStatuses])
      .mockReturnValueOnce(['abc123', setAccountID]);
  });

  it('renders the no results heading and body text', () => {
    renderWithRouter(<NoSearchResults />);

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(
      screen.getByText(
        /No results match the filter criteria\. Remove individual filters or clear all filters to show results\./i,
      ),
    ).toBeInTheDocument();
  });

  it('renders the clear all filters button', () => {
    renderWithRouter(<NoSearchResults />);

    expect(
      screen.getByRole('button', { name: /clear all filters/i }),
    ).toBeInTheDocument();
  });
});
