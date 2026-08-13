import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useAtomValue } from 'jotai';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { MarketplacePurchasesMarketplaceFilter } from '../MarketplacePurchasesMarketplaceFilter';
import { MarketplaceFilterData } from '../../../state/marketplacePurchases';

const MarketplaceFilterWithState = ({ marketplaces = [] }: { marketplaces?: string[] }) => (
  <HydrateAtomsTestProvider initialValues={[[MarketplaceFilterData, marketplaces]]}>
    <MarketplacePurchasesMarketplaceFilter />
  </HydrateAtomsTestProvider>
);

const MarketplaceFilterWithStateObserver = ({ marketplaces = [] }: { marketplaces?: string[] }) => {
  const StateObserver = () => {
    const selectedMarketplaces = useAtomValue(MarketplaceFilterData);

    return <div data-testid="selected-marketplaces">{JSON.stringify(selectedMarketplaces)}</div>;
  };

  return (
    <HydrateAtomsTestProvider initialValues={[[MarketplaceFilterData, marketplaces]]}>
      <MarketplacePurchasesMarketplaceFilter />
      <StateObserver />
    </HydrateAtomsTestProvider>
  );
};

describe('MarketplacePurchasesMarketplaceFilter', () => {
  it('renders the default label when no marketplace is selected', () => {
    renderWithRouter(<MarketplaceFilterWithState />);

    expect(screen.getByRole('button', { name: 'Filter by marketplace' })).toBeInTheDocument();
  });

  it('renders the available marketplaces when opened', async () => {
    renderWithRouter(<MarketplaceFilterWithState />);

    fireEvent.click(screen.getByRole('button', { name: 'Filter by marketplace' }));

    await waitFor(() => {
      expect(screen.getByText('AWS')).toBeInTheDocument();
      expect(screen.getByText('Microsoft Azure')).toBeInTheDocument();
    });
  });

  it('adds the selected marketplace backend value to state', async () => {
    renderWithRouter(<MarketplaceFilterWithStateObserver />);

    fireEvent.click(screen.getByRole('button', { name: 'Filter by marketplace' }));

    await waitFor(() => {
      expect(screen.getByText('AWS')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('AWS'));

    await waitFor(() => {
      expect(screen.getByTestId('selected-marketplaces')).toHaveTextContent('["aws_marketplace"]');
    });
  });

  it('shows Marketplace label when initialized with a selected marketplace', () => {
    renderWithRouter(<MarketplaceFilterWithState marketplaces={['aws_marketplace']} />);

    expect(screen.getByRole('button', { name: /Marketplace/i })).toBeInTheDocument();
  });

  it('supports multiple selected marketplaces', async () => {
    renderWithRouter(<MarketplaceFilterWithStateObserver marketplaces={['aws_marketplace']} />);

    fireEvent.click(screen.getByRole('button', { name: /Marketplace/i }));

    await waitFor(() => {
      expect(screen.getByText('Microsoft Azure')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Microsoft Azure'));

    await waitFor(() => {
      expect(screen.getByTestId('selected-marketplaces')).toHaveTextContent(
        '["aws_marketplace","azure_marketplace"]'
      );
    });
  });

  it('keeps previously selected marketplaces when another marketplace is selected', async () => {
    renderWithRouter(<MarketplaceFilterWithStateObserver marketplaces={['aws_marketplace']} />);

    fireEvent.click(screen.getByRole('button', { name: /Marketplace/i }));

    await waitFor(() => {
      expect(screen.getByText('Microsoft Azure')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Microsoft Azure'));

    await waitFor(() => {
      expect(screen.getByTestId('selected-marketplaces')).toHaveTextContent(
        '["aws_marketplace","azure_marketplace"]'
      );
    });
  });
});
