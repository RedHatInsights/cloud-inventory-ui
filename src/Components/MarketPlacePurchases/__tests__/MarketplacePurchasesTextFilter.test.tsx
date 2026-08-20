import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { MarketplacePurchasesTextFilter } from '../MarketplacePurchasesTextFilter';
import {
  MarketplaceAccountFilterData,
  MarketplaceOfferingNameFilterData
} from '../../../state/marketplacePurchases';

const MarketplacePurchasesTextFilterWithState = ({
  activeCategory = 'OfferingName',
  offeringName = '',
  marketplaceAccount = ''
}: {
  activeCategory?: 'OfferingName' | 'MarketplaceAccount';
  offeringName?: string;
  marketplaceAccount?: string;
  marketplace?: string;
}) => (
  <HydrateAtomsTestProvider
    initialValues={[
      [MarketplaceOfferingNameFilterData, offeringName],
      [MarketplaceAccountFilterData, marketplaceAccount]
    ]}
  >
        
    <MarketplacePurchasesTextFilter activeCategory={activeCategory} />
      
  </HydrateAtomsTestProvider>
);

describe('MarketplacePurchasesTextFilter', () => {
  it('displays the correct offering name when state has a value', () => {
    renderWithRouter(<MarketplacePurchasesTextFilterWithState offeringName="Azure" />);

    const input = screen.getByPlaceholderText('Filter by offering name') as HTMLInputElement;

    expect(input.value).toBe('Azure');
  });

  it('updates the input value when the user types', () => {
    renderWithRouter(<MarketplacePurchasesTextFilterWithState />);

    const input = screen.getByPlaceholderText('Filter by offering name');

    fireEvent.change(input, {
      target: { value: 'OpenShift' }
    });

    expect(input).toHaveValue('OpenShift');
  });

  it('clears the input value when the reset button is clicked', async () => {
    renderWithRouter(<MarketplacePurchasesTextFilterWithState offeringName="Azure" />);

    const input = screen.getByPlaceholderText('Filter by offering name') as HTMLInputElement;

    expect(input.value).toBe('Azure');

    const clearButton = screen.getByRole('button', {
      name: /reset/i
    });

    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('is empty when no initial value is provided', () => {
    renderWithRouter(<MarketplacePurchasesTextFilterWithState />);

    const input = screen.getByPlaceholderText('Filter by offering name');

    expect(input).toHaveValue('');
    expect(
      screen.queryByRole('button', {
        name: /reset/i
      })
    ).not.toBeInTheDocument();
  });

  it('displays the marketplace account value when that filter is selected', () => {
    renderWithRouter(
      <MarketplacePurchasesTextFilterWithState
        activeCategory="MarketplaceAccount"
        marketplaceAccount="123456789"
      />
    );

    expect(screen.getByPlaceholderText('Filter by marketplace account')).toHaveValue('123456789');
  });
});
