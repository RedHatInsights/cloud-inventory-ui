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
  marketplaces = []
}: {
  offeringName?: string;
  marketplaceAccount?: string;
  marketplaces?: string[];
} = {}) =>
  renderWithRouter(
    <HydrateAtomsTestProvider
      initialValues={[
        [MarketplaceOfferingNameFilterData, offeringName],
        [MarketplaceAccountFilterData, marketplaceAccount],
        [MarketplaceFilterData, marketplaces]
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

  it('renders selected marketplaces using friendly labels', () => {
    renderFilterList({
      marketplaces: ['aws_marketplace', 'azure_marketplace']
    });

    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Azure')).toBeInTheDocument();
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

  it('removes only the selected marketplace when its label is closed', () => {
    renderFilterList({
      marketplaces: ['aws_marketplace', 'azure_marketplace']
    });

    const awsLabel = screen.getByText('AWS').closest('.pf-v6-c-label');

    expect(awsLabel).not.toBeNull();

    const closeButton = awsLabel?.querySelector('button');

    expect(closeButton).not.toBeNull();

    fireEvent.click(closeButton!);

    expect(screen.queryByText('AWS')).not.toBeInTheDocument();
    expect(screen.getByText('Microsoft Azure')).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
  });

  it('clears all active filters when clear all filters is clicked', () => {
    renderFilterList({
      offeringName: 'OpenShift',
      marketplaceAccount: '123456789',
      marketplaces: ['aws_marketplace', 'azure_marketplace']
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: /clear all filters/i
      })
    );

    expect(screen.queryByText('OpenShift')).not.toBeInTheDocument();
    expect(screen.queryByText('123456789')).not.toBeInTheDocument();
    expect(screen.queryByText('AWS')).not.toBeInTheDocument();
    expect(screen.queryByText('Microsoft Azure')).not.toBeInTheDocument();

    expect(screen.queryByText('Offering name')).not.toBeInTheDocument();
    expect(screen.queryByText('Marketplace account')).not.toBeInTheDocument();
    expect(screen.queryByText('Marketplace')).not.toBeInTheDocument();
  });

  it('hides clear all filters after the last active marketplace is removed', () => {
    renderFilterList({
      marketplaces: ['aws_marketplace']
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
