import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { MarketplacePurchasesPaginationData } from '../../../state/marketplacePurchases';
import { MarketplacePurchasesToolbar } from '../MarkteplacePurchasesToolbar';

beforeEach(() => {
  window.history.pushState({}, '', '/');
});

const renderToolbar = ({
  page = 1,
  perPage = 10,
  itemCount = 25,
}: {
  page?: number;
  perPage?: number;
  itemCount?: number;
} = {}) =>
  renderWithRouter(
    <HydrateAtomsTestProvider
      initialValues={[
        [
          MarketplacePurchasesPaginationData,
          {
            page,
            perPage,
            itemCount,
          },
        ],
      ]}
    >
            
      <MarketplacePurchasesToolbar />
          
    </HydrateAtomsTestProvider>,
  );

describe('MarketplacePurchasesToolbar', () => {
  it('renders the toolbar', () => {
    const { container } = renderToolbar();

    expect(
      container.querySelector('#marketplace-purchases-toolbar'),
    ).toBeInTheDocument();
  });

  it('renders compact pagination with the correct total', () => {
    renderToolbar({
      page: 1,
      perPage: 10,
      itemCount: 25,
    });

    expect(
      screen.getByRole('button', {
        name: /1\s*[–-]\s*10 of 25/i,
      }),
    ).toBeInTheDocument();
  });

  it('moves to the next page', () => {
    renderToolbar({
      page: 1,
      perPage: 10,
      itemCount: 25,
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: /go to next page/i,
      }),
    );

    expect(
      screen.getByRole('button', {
        name: /11\s*[–-]\s*20 of 25/i,
      }),
    ).toBeInTheDocument();
  });

  it('moves to the previous page', () => {
    renderToolbar({
      page: 2,
      perPage: 10,
      itemCount: 25,
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: /go to previous page/i,
      }),
    );

    expect(
      screen.getByRole('button', {
        name: /1\s*[–-]\s*10 of 25/i,
      }),
    ).toBeInTheDocument();
  });

  it('disables the previous page button on the first page', () => {
    renderToolbar({
      page: 1,
      perPage: 10,
      itemCount: 25,
    });

    expect(
      screen.getByRole('button', {
        name: /go to previous page/i,
      }),
    ).toBeDisabled();
  });

  it('disables the next page button on the last page', () => {
    renderToolbar({
      page: 3,
      perPage: 10,
      itemCount: 25,
    });

    expect(
      screen.getByRole('button', {
        name: /go to next page/i,
      }),
    ).toBeDisabled();
  });
});
