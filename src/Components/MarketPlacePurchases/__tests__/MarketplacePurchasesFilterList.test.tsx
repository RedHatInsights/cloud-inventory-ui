import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { MarketplacePurchasesFilterList } from '../MarketplacePurchasesFilterList';
import {
  MarketplaceAccountFilterData,
  MarketplaceFilterData,
  MarketplaceOfferingNameFilterData
} from '../../../state/marketplacePurchases';

const renderFilterList = ({
  offeringName = '',
  marketplaceAccount = '',
  marketplace = ''
}: {
  offeringName?: string;
  marketplaceAccount?: string;
  marketplace?: string;
} = {}) =>
  renderWithRouter(
    <HydrateAtomsTestProvider
      initialValues={[
        [MarketplaceOfferingNameFilterData, offeringName],
        [MarketplaceAccountFilterData, marketplaceAccount],
        [MarketplaceFilterData, marketplace]
      ]}
    >
            
      <MarketplacePurchasesFilterList />
          
    </HydrateAtomsTestProvider>
  );

beforeEach(() => {
  window.history.pushState({}, '', '/');
});

describe('MarketplacePurchasesFilterList', () => {
  it('renders nothing filter-related when no filters are active', () => {
    renderFilterList();

    expect(
      screen.queryByRole('button', {
        name: /clear all filters/i
      })
    ).not.toBeInTheDocument();

    expect(screen.queryByText('Offering name')).not.toBeInTheDocument();
    expect(screen.queryByText('Marketplace account')).not.toBeInTheDocument();
    expect(screen.queryByText('Marketplace')).not.toBeInTheDocument();
  });

  it('renders the selected offering name filter', () => {
    renderFilterList({
      offeringName: 'OpenShift'
    });

    expect(screen.getByText('Offering name')).toBeInTheDocument();
    expect(screen.getByText('OpenShift')).toBeInTheDocument();
  });

  it('renders the selected marketplace account filter', () => {
    renderFilterList({
      marketplaceAccount: '123456789'
    });

    expect(screen.getByText('Marketplace account')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
  });

  it('renders the selected marketplace filter', () => {
    renderFilterList({
      marketplace: 'AWS'
    });

    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });

  it('removes the offering name filter when its label is closed', () => {
    renderFilterList({
      offeringName: 'OpenShift'
    });

    const closeButtons = screen
      .getAllByRole('button')
      .filter((button) => button.getAttribute('aria-label')?.toLowerCase().includes('close'));

    expect(closeButtons.length).toBeGreaterThan(0);

    fireEvent.click(closeButtons[0]);

    expect(screen.queryByText('OpenShift')).not.toBeInTheDocument();
    expect(screen.queryByText('Offering name')).not.toBeInTheDocument();
  });

  it('clears all active filters when clear all filters is clicked', () => {
    renderFilterList({
      offeringName: 'OpenShift',
      marketplaceAccount: '123456789',
      marketplace: 'AWS'
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: /clear all filters/i
      })
    );

    expect(screen.queryByText('OpenShift')).not.toBeInTheDocument();
    expect(screen.queryByText('123456789')).not.toBeInTheDocument();
    expect(screen.queryByText('AWS')).not.toBeInTheDocument();

    expect(screen.queryByText('Offering name')).not.toBeInTheDocument();
    expect(screen.queryByText('Marketplace account')).not.toBeInTheDocument();
    expect(screen.queryByText('Marketplace')).not.toBeInTheDocument();
  });

  it('hides clear all filters after the last active filter is removed', () => {
    renderFilterList({
      marketplace: 'AWS'
    });

    const closeButtons = screen
      .getAllByRole('button')
      .filter((button) => button.getAttribute('aria-label')?.toLowerCase().includes('close'));

    fireEvent.click(closeButtons[0]);

    expect(
      screen.queryByRole('button', {
        name: /clear all filters/i
      })
    ).not.toBeInTheDocument();
  });
});
