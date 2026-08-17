import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { MarketplacePurchasesFilter } from '../MarketplacePurchasesFilter';
import { MarketplacePurchasesFilterCategoryData } from '../../../state/marketplacePurchases';
import { MarketplaceFilterCategory } from '../MarketplacePurchasesTextFilter';

const MarketplacePurchasesFilterWithState = ({
  init = 'OfferingName'
}: {
  init?: MarketplaceFilterCategory;
}) => (
  <HydrateAtomsTestProvider initialValues={[[MarketplacePurchasesFilterCategoryData, init]]}>
    <MarketplacePurchasesFilter />
  </HydrateAtomsTestProvider>
);

describe('MarketplacePurchasesFilter', () => {
  it('renders the selected filter category', () => {
    renderWithRouter(<MarketplacePurchasesFilterWithState />);

    expect(screen.getByRole('button', { name: 'Offering name' })).toBeInTheDocument();
  });

  it('shows the available filter categories when opened', async () => {
    renderWithRouter(<MarketplacePurchasesFilterWithState />);

    fireEvent.click(screen.getByRole('button', { name: 'Offering name' }));

    await waitFor(() => {
      expect(screen.getByText('Marketplace account')).toBeInTheDocument();
      expect(screen.getByText('Marketplace')).toBeInTheDocument();
    });
  });

  it('allows the user to select Marketplace account', async () => {
    renderWithRouter(<MarketplacePurchasesFilterWithState />);

    fireEvent.click(screen.getByRole('button', { name: 'Offering name' }));

    await waitFor(() => {
      expect(screen.getByText('Marketplace account')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Marketplace account'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Marketplace account' })).toBeInTheDocument();
    });
  });
});
