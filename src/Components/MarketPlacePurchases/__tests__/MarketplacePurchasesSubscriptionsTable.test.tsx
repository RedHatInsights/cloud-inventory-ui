import React from 'react';
import { fireEvent, screen, within } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { MarketplacePurchasesSubscriptionsTable } from '../MarketplacePurchasesSubscriptionsTable';

const subscriptions = [
  {
    sku: 'SKU-300',
    description: 'Zulu subscription'
  },
  {
    sku: 'SKU-100',
    description: 'Alpha subscription'
  },
  {
    sku: 'SKU-200',
    description: 'Mike subscription'
  }
];

describe('MarketplacePurchasesSubscriptionsTable', () => {
  it('renders all subscriptions in the original order by default', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsTable subscriptions={subscriptions} />);

    expect(
      screen.getByRole('grid', {
        name: /subscriptions table/i
      })
    ).toBeInTheDocument();

    const rows = screen.getAllByRole('row');

    expect(rows).toHaveLength(4);

    expect(within(rows[1]).getByText('Zulu subscription')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Alpha subscription')).toBeInTheDocument();
    expect(within(rows[3]).getByText('Mike subscription')).toBeInTheDocument();
  });

  it('links subscription names to subscription inventory', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsTable subscriptions={subscriptions} />);

    expect(
      screen.getByRole('link', {
        name: 'Alpha subscription'
      })
    ).toHaveAttribute('href', '/subscriptions/inventory/SKU-100');
  });

  it('sorts subscriptions by name ascending and descending', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsTable subscriptions={subscriptions} />);

    const subscriptionNameSortButton = screen.getByRole('button', {
      name: /subscription name/i
    });

    fireEvent.click(subscriptionNameSortButton);

    let rows = screen.getAllByRole('row');

    expect(within(rows[1]).getByText('Alpha subscription')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Mike subscription')).toBeInTheDocument();
    expect(within(rows[3]).getByText('Zulu subscription')).toBeInTheDocument();

    fireEvent.click(subscriptionNameSortButton);

    rows = screen.getAllByRole('row');

    expect(within(rows[1]).getByText('Zulu subscription')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Mike subscription')).toBeInTheDocument();
    expect(within(rows[3]).getByText('Alpha subscription')).toBeInTheDocument();
  });

  it('sorts subscriptions by SKU ascending and descending', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsTable subscriptions={subscriptions} />);

    const skuSortButton = screen.getByRole('button', {
      name: /^sku$/i
    });

    fireEvent.click(skuSortButton);

    let rows = screen.getAllByRole('row');

    expect(within(rows[1]).getByText('SKU-100')).toBeInTheDocument();
    expect(within(rows[2]).getByText('SKU-200')).toBeInTheDocument();
    expect(within(rows[3]).getByText('SKU-300')).toBeInTheDocument();

    fireEvent.click(skuSortButton);

    rows = screen.getAllByRole('row');

    expect(within(rows[1]).getByText('SKU-300')).toBeInTheDocument();
    expect(within(rows[2]).getByText('SKU-200')).toBeInTheDocument();
    expect(within(rows[3]).getByText('SKU-100')).toBeInTheDocument();
  });

  it('does not apply an active sort on initial render', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsTable subscriptions={subscriptions} />);

    const subscriptionNameHeader = screen.getByRole('columnheader', {
      name: /subscription name/i
    });

    const skuHeader = screen.getByRole('columnheader', {
      name: /^sku$/i
    });

    expect(subscriptionNameHeader).not.toHaveAttribute('aria-sort');
    expect(skuHeader).not.toHaveAttribute('aria-sort');
  });

  it('filters subscriptions by subscription name', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsTable subscriptions={subscriptions} />);

    const filterInput = screen.getByPlaceholderText(/filter by name or sku/i);

    fireEvent.change(filterInput, {
      target: {
        value: 'Alpha'
      }
    });

    expect(screen.getByText('Alpha subscription')).toBeInTheDocument();

    expect(screen.queryByText('Zulu subscription')).not.toBeInTheDocument();
    expect(screen.queryByText('Mike subscription')).not.toBeInTheDocument();
  });

  it('filters subscriptions by SKU', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsTable subscriptions={subscriptions} />);

    const filterInput = screen.getByPlaceholderText(/filter by name or sku/i);

    fireEvent.change(filterInput, {
      target: {
        value: 'SKU-200'
      }
    });

    expect(screen.getByText('Mike subscription')).toBeInTheDocument();
    expect(screen.getByText('SKU-200')).toBeInTheDocument();

    expect(screen.queryByText('Zulu subscription')).not.toBeInTheDocument();
    expect(screen.queryByText('Alpha subscription')).not.toBeInTheDocument();
  });

  it('filters subscriptions case-insensitively', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsTable subscriptions={subscriptions} />);

    const filterInput = screen.getByPlaceholderText(/filter by name or sku/i);

    fireEvent.change(filterInput, {
      target: {
        value: 'alpha'
      }
    });

    expect(screen.getByText('Alpha subscription')).toBeInTheDocument();
    expect(screen.queryByText('Zulu subscription')).not.toBeInTheDocument();
    expect(screen.queryByText('Mike subscription')).not.toBeInTheDocument();
  });

  it('filters subscriptions by partial match', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsTable subscriptions={subscriptions} />);

    const filterInput = screen.getByPlaceholderText(/filter by name or sku/i);

    fireEvent.change(filterInput, {
      target: {
        value: '200'
      }
    });

    expect(screen.getByText('Mike subscription')).toBeInTheDocument();
    expect(screen.queryByText('Zulu subscription')).not.toBeInTheDocument();
    expect(screen.queryByText('Alpha subscription')).not.toBeInTheDocument();
  });

  it('shows all subscriptions when the filter is cleared', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsTable subscriptions={subscriptions} />);

    const filterInput = screen.getByPlaceholderText(/filter by name or sku/i);

    fireEvent.change(filterInput, {
      target: {
        value: 'Alpha'
      }
    });

    expect(screen.queryByText('Zulu subscription')).not.toBeInTheDocument();

    fireEvent.change(filterInput, {
      target: {
        value: ''
      }
    });

    expect(screen.getByText('Zulu subscription')).toBeInTheDocument();
    expect(screen.getByText('Alpha subscription')).toBeInTheDocument();
    expect(screen.getByText('Mike subscription')).toBeInTheDocument();
  });
});
