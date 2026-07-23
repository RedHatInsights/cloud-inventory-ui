import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { MarketplacePurchasesTable } from '../MarketplacePurchasesTable';
import { MarketplacePurchase } from '../../../hooks/api/useMarketplacePurchases';

jest.mock('../../../hooks/util/dates', () => ({
  formatDate: (date: string) => `Formatted:${date}`,
}));

const makeMarketplacePurchases = (count: number): MarketplacePurchase[] =>
  Array.from({ length: count }).map((_, index) => ({
    offeringName: `Offering ${index}`,
    marketplaceAccount: `account-${index}`,
    marketplace: index % 2 === 0 ? 'aws_marketplace' : 'azure_marketplace',
    startDate: `2026-01-${String(index + 1).padStart(2, '0')}`,
    skus: [`SKU-${index}`],
  }));

const renderTable = (purchases: MarketplacePurchase[]) =>
  renderWithRouter(
    <MarketplacePurchasesTable marketplacePurchases={purchases} />,
  );

describe('MarketplacePurchasesTable', () => {
  it('renders the marketplace purchases table', () => {
    renderTable(makeMarketplacePurchases(2));

    expect(
      screen.getByRole('grid', {
        name: /marketplace purchases table/i,
      }),
    ).toBeInTheDocument();
  });

  it('renders marketplace purchase data', () => {
    renderTable(makeMarketplacePurchases(2));

    expect(screen.getByText('Offering 0')).toBeInTheDocument();
    expect(screen.getByText('account-0')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();

    expect(screen.getByText('Offering 1')).toBeInTheDocument();
    expect(screen.getByText('account-1')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Azure')).toBeInTheDocument();
  });

  it('renders one row for each marketplace purchase', () => {
    renderTable(makeMarketplacePurchases(3));

    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('renders formatted dates', () => {
    renderTable(makeMarketplacePurchases(2));

    expect(screen.getByText('Formatted:2026-01-01')).toBeInTheDocument();

    expect(screen.getByText('Formatted:2026-01-02')).toBeInTheDocument();
  });

  it('renders only the header row when no purchases are present', () => {
    renderTable([]);

    expect(
      screen.getByRole('grid', {
        name: /marketplace purchases table/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getAllByRole('row')).toHaveLength(1);
  });
});
