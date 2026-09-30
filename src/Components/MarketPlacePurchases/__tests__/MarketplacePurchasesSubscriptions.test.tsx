import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { MarketplacePurchasesSubscriptions } from '../MarketplacePurchasesSubscriptions';
import { useMarketplacePurchasesSkuDetails } from '../../../hooks/api/useMarketplacePurchasesSkuDetails';

jest.mock('../../../hooks/api/useMarketplacePurchasesSkuDetails');

const mockUseMarketplacePurchasesSkuDetails = useMarketplacePurchasesSkuDetails as jest.Mock;

const renderComponent = (skus = ['123456', '789012']) =>
  renderWithRouter(<MarketplacePurchasesSubscriptions skus={skus} isExpanded />);

beforeEach(() => {
  window.history.pushState({}, '', '/');
  jest.clearAllMocks();
});

describe('MarketplacePurchasesSubscriptions', () => {
  it('shows a loading indicator while subscription details are loading', () => {
    mockUseMarketplacePurchasesSkuDetails.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false
    });

    renderComponent();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows subscription name and SKU when details load', () => {
    mockUseMarketplacePurchasesSkuDetails.mockReturnValue({
      data: {
        body: [
          {
            sku: '123456',
            description: 'Test subscription'
          }
        ]
      },
      isLoading: false,
      isError: false
    });

    renderComponent();

    expect(screen.getByText('Subscription name')).toBeInTheDocument();
    expect(screen.getByText('SKU')).toBeInTheDocument();
    expect(screen.getByText('Test subscription')).toBeInTheDocument();
    expect(screen.getByText('123456')).toBeInTheDocument();
  });

  it('links the subscription name to Subscription Inventory', () => {
    mockUseMarketplacePurchasesSkuDetails.mockReturnValue({
      data: {
        body: [
          {
            sku: '123456',
            description: 'Test subscription'
          }
        ]
      },
      isLoading: false,
      isError: false
    });

    renderComponent();

    expect(
      screen.getByRole('link', {
        name: 'Test subscription'
      })
    ).toHaveAttribute('href', '/subscriptions/inventory/123456');
  });

  it('shows the failure message with a SKU details link', () => {
    mockUseMarketplacePurchasesSkuDetails.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true
    });

    renderComponent();

    const errorMessages = screen.getAllByText(/The request for subscription names failed/i);

    expect(errorMessages).toHaveLength(2);

    expect(
      screen.getByRole('link', {
        name: '123456'
      })
    ).toHaveAttribute('href', '/subscriptions/inventory/123456');

    expect(
      screen.getByRole('link', {
        name: '789012'
      })
    ).toHaveAttribute('href', '/subscriptions/inventory/789012');
  });
});
