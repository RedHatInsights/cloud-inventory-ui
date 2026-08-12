import React, { useState } from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { MarketplacePurchasesTable } from '../MarketplacePurchasesTable';
import {
  MarketplacePurchase,
  MarketplacePurchaseSortField
} from '../../../hooks/api/useMarketplacePurchases';
import { HydrateAtomsTestProvider } from '../../../Components/util/testing/HydrateAtomsTestProvider';
import { MarketplacePurchasesPaginationData } from '../../../state/marketplacePurchases';
import { Paths } from '../../../utils/routing';
import { SortByDirection } from '@patternfly/react-table';

const makeMarketplacePurchases = (count: number): MarketplacePurchase[] =>
  Array.from({ length: count }).map((_, index) => ({
    offeringName: `Offering ${index}`,
    marketplaceAccount: `account-${index}`,
    marketplace: index % 2 === 0 ? 'aws_marketplace' : 'azure_marketplace',
    startDate: `2026-01-${String(index + 1).padStart(2, '0')}`,
    skus: [`SKU-${index}`]
  }));

const defaultPagination = {
  page: 1,
  perPage: 10,
  itemCount: 10
};

const renderTable = (
  purchases: MarketplacePurchase[],
  pagination = defaultPagination,
  withSortState = false
) => {
  const TableWithState = () => {
    const [sortBy, setSortBy] = useState<MarketplacePurchaseSortField | undefined>(undefined);
    const [sortDir, setSortDir] = useState<SortByDirection | undefined>(undefined);

    return (
      <HydrateAtomsTestProvider initialValues={[[MarketplacePurchasesPaginationData, pagination]]}>
        <MarketplacePurchasesTable
          marketplacePurchases={purchases}
          sortBy={withSortState ? sortBy : undefined}
          sortDir={withSortState ? sortDir : undefined}
          setSortBy={withSortState ? setSortBy : jest.fn()}
          setSortDir={withSortState ? setSortDir : jest.fn()}
        />
      </HydrateAtomsTestProvider>
    );
  };

  return renderWithRouter(<TableWithState />);
};

describe('MarketplacePurchasesTable', () => {
  it('renders the marketplace purchases table', () => {
    renderTable(makeMarketplacePurchases(2));

    expect(
      screen.getByRole('grid', {
        name: /marketplace purchases table/i
      })
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

    expect(screen.getByText('2026-01-01')).toBeInTheDocument();
    expect(screen.getByText('2026-01-02')).toBeInTheDocument();
  });

  it('does not render pagination error when on valid page', () => {
    renderTable(makeMarketplacePurchases(25), {
      page: 1,
      perPage: 10,
      itemCount: 25
    });

    expect(screen.queryByText(/No results for current page/i)).not.toBeInTheDocument();
  });

  it('renders pagination error when page exceeds item count', () => {
    const purchases = makeMarketplacePurchases(5);

    renderTable(purchases, {
      page: 10,
      perPage: 10,
      itemCount: 5
    });

    expect(screen.getByText(/No results for current page/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /return to page 1/i
      })
    ).toBeInTheDocument();
  });

  it('does not render table content when pagination error is shown', () => {
    const purchases = makeMarketplacePurchases(5);

    renderTable(purchases, {
      page: 10,
      perPage: 10,
      itemCount: 5
    });

    expect(screen.queryByText('Offering name')).not.toBeInTheDocument();

    expect(screen.queryByText('Marketplace account')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('grid', {
        name: /marketplace purchases table/i
      })
    ).not.toBeInTheDocument();
  });

  it('clears pagination error and returns to first page when clicking "Return to page 1"', async () => {
    const purchases = makeMarketplacePurchases(5);

    renderTable(purchases, {
      page: 10,
      perPage: 10,
      itemCount: 5
    });

    expect(screen.getByText(/No results for current page/i)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: /return to page 1/i
      })
    );

    expect(screen.queryByText(/No results for current page/i)).not.toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(purchases[0].offeringName)).toBeInTheDocument());
  });

  describe('cloud account link', () => {
    it('renders the link', () => {
      const marketplacePurchases = makeMarketplacePurchases(2);
      renderTable(marketplacePurchases);

      expect(
        screen.getByText(marketplacePurchases[0].marketplaceAccount).getAttribute('href')
      ).not.toBeNull();
    });

    it('renders the link with expected query params', () => {
      const marketplacePurchases = makeMarketplacePurchases(2);
      renderTable(marketplacePurchases);

      expect(
        screen.getByText(marketplacePurchases[0].marketplaceAccount).getAttribute('href')
      ).toBe(
        `/${Paths.CloudAccounts}?providerAccountID=${encodeURI(`["${marketplacePurchases[0].marketplaceAccount}"]`)}`
      );
    });
  });

  it('allows a user to sort marketplace purchases by offering name', () => {
    renderTable(makeMarketplacePurchases(3), defaultPagination, true);

    const offeringNameHeader = screen.getByRole('columnheader', {
      name: /offering name/i
    });

    expect(offeringNameHeader).not.toHaveAttribute('aria-sort', 'ascending');

    fireEvent.click(
      screen.getByRole('button', {
        name: /offering name/i
      })
    );

    expect(offeringNameHeader).toHaveAttribute('aria-sort', 'ascending');
  });
  it('allows a user to sort by each marketplace purchase column', () => {
    renderTable(makeMarketplacePurchases(3), defaultPagination, true);

    const sortableColumns = [
      /offering name/i,
      /marketplace account/i,
      /^marketplace$/i,
      /date added/i
    ];

    sortableColumns.forEach((name) => {
      const button = screen.getByRole('button', { name });

      expect(button).toBeInTheDocument();

      fireEvent.click(button);

      const columnHeader = button.closest('th');

      expect(columnHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });
});
