import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { MarketplacePurchasesSubscriptionsModal } from '../MarketplacePurchasesSubscriptionsModal';
import { Paths } from '../../../utils/routing';

const subscriptions = [
  {
    sku: 'SKU-100',
    description: 'Alpha subscription'
  },
  {
    sku: 'SKU-200',
    description: 'Beta subscription'
  }
];

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  subscriptions,
  marketplaceAccount: 'account-123',
  offeringName: 'Test offering'
};

describe('MarketplacePurchasesSubscriptionsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when open', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
  });

  it('renders the offering name', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsModal {...defaultProps} />);

    expect(screen.getByText('Offering name')).toBeInTheDocument();
    expect(screen.getByText('Test offering')).toBeInTheDocument();
  });

  it('renders the marketplace account', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsModal {...defaultProps} />);

    expect(screen.getByText('Marketplace account')).toBeInTheDocument();
    expect(screen.getByText('account-123')).toBeInTheDocument();
  });

  it('links the marketplace account to Cloud Accounts', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsModal {...defaultProps} />);

    const accountLink = screen.getByRole('link', {
      name: 'account-123'
    });

    expect(accountLink).toHaveAttribute(
      'href',
      `/${Paths.CloudAccounts}?providerAccountID=${encodeURI('["account-123"]')}`
    );
  });

  it('renders all subscriptions', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsModal {...defaultProps} />);

    expect(screen.getByText('Alpha subscription')).toBeInTheDocument();
    expect(screen.getByText('SKU-100')).toBeInTheDocument();

    expect(screen.getByText('Beta subscription')).toBeInTheDocument();
    expect(screen.getByText('SKU-200')).toBeInTheDocument();
  });

  it('does not render the modal when closed', () => {
    renderWithRouter(<MarketplacePurchasesSubscriptionsModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
