import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { CloudAccountsToolbar } from '../CloudAccountsToolbar';
import {
  cloudAccountIDFilterData,
  cloudAccountsFilterCategoryData,
  cloudProviderFilterData,
  goldImageStatusFilterData,
} from '../../../state/cloudAccounts';
import { CloudProviderShortname } from '../../../types/cloudAccountsTypes';

jest.mock('../CloudAccountsPagination', () => ({
  CloudAccountsPagination: () => (
    <div data-testid="cloud-accounts-pagination">Pagination</div>
  ),
}));

beforeEach(() => {
  window.history.pushState({}, '', '/');
});

const renderToolbar = ({
  selectedID = '',
  selectedProviders = [],
  selectedStatuses = [],
  activeCategory = 'ID',
}: {
  selectedID?: string;
  selectedProviders?: string[];
  selectedStatuses?: string[];
  activeCategory?: 'ID' | 'Provider' | 'Status';
} = {}) =>
  renderWithRouter(
    <HydrateAtomsTestProvider
      initialValues={[
        [cloudAccountIDFilterData, selectedID],
        [cloudAccountsFilterCategoryData, activeCategory],
        [cloudProviderFilterData, selectedProviders],
        [goldImageStatusFilterData, selectedStatuses],
      ]}
    >
            
      <CloudAccountsToolbar
        availableProviders={[
          CloudProviderShortname.AWS,
          CloudProviderShortname.GCP,
        ]}
        availableStatuses={['Granted', 'Failed']}
      />
          
    </HydrateAtomsTestProvider>,
  );

describe('CloudAccountsToolbar', () => {
  it('renders with ID filter by default', () => {
    renderToolbar();

    expect(
      screen.getByRole('button', { name: /^cloud account$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/filter by cloud account id/i),
    ).toBeInTheDocument();
  });

  it('displays selected ID filter', () => {
    renderToolbar({ selectedID: 'acct-123' });

    expect(screen.getByText('acct-123')).toBeInTheDocument();
    expect(screen.getAllByText('Cloud account').length).toBeGreaterThan(0);
  });

  it('shows clear all button when filters are active', () => {
    renderToolbar({
      selectedProviders: [CloudProviderShortname.AWS],
    });

    expect(
      screen.getByRole('button', { name: /clear all filters/i }),
    ).toBeInTheDocument();
  });

  it('does not show clear all when no filters are active', () => {
    renderToolbar();

    expect(
      screen.queryByRole('button', { name: /clear all filters/i }),
    ).not.toBeInTheDocument();
  });

  it('removes selected ID when label close button is clicked', () => {
    renderToolbar({ selectedID: 'acct-123' });

    expect(screen.getByText('acct-123')).toBeInTheDocument();

    const closeButtons = screen
      .getAllByRole('button')
      .filter((button) =>
        button.getAttribute('aria-label')?.toLowerCase().includes('close'),
      );

    if (closeButtons.length === 0) {
      throw new Error('Expected label close button to exist');
    }

    fireEvent.click(closeButtons[0]);

    expect(screen.queryByText('acct-123')).not.toBeInTheDocument();
  });

  it('switches to provider filter when Cloud provider category is selected', () => {
    renderToolbar({ activeCategory: 'ID' });

    fireEvent.click(screen.getByRole('button', { name: /cloud account/i }));
    fireEvent.click(screen.getByText('Cloud provider'));

    expect(
      screen.getByRole('button', { name: /filter by cloud provider/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('cloud-account-id-filter'),
    ).not.toBeInTheDocument();
  });

  it('switches to status filter when Gold image access category is selected', () => {
    renderToolbar({ activeCategory: 'ID' });

    fireEvent.click(screen.getByRole('button', { name: /cloud account/i }));
    fireEvent.click(screen.getByText('Gold image access'));

    expect(
      screen.getByRole('button', { name: /filter by status|status/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('cloud-account-id-filter'),
    ).not.toBeInTheDocument();
  });

  it('displays selected provider and status filters', () => {
    renderToolbar({
      selectedProviders: [CloudProviderShortname.AWS],
      selectedStatuses: ['Granted'],
    });

    expect(screen.getAllByText('Cloud provider').length).toBeGreaterThan(0);
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getAllByText('Gold image access').length).toBeGreaterThan(0);
    expect(screen.getByText('Granted')).toBeInTheDocument();
  });

  it('renders status filter when active category is Status on initial render', () => {
    renderToolbar({ activeCategory: 'Status' });

    expect(
      screen.getByRole('button', { name: /filter by status|status/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId('cloud-account-id-filter'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByTestId('cloud-account-provider-filter'),
    ).not.toBeInTheDocument();
  });

  it('always renders compact pagination', () => {
    renderToolbar();

    expect(screen.getByTestId('cloud-accounts-pagination')).toBeInTheDocument();
  });

  it('shows clear all button when status filter is active', () => {
    renderToolbar({ selectedStatuses: ['Granted'] });

    expect(
      screen.getByRole('button', { name: /clear all filters/i }),
    ).toBeInTheDocument();
  });

  it('displays selected provider filters only when provider filters are present', () => {
    renderToolbar({
      selectedProviders: [CloudProviderShortname.AWS],
    });

    expect(screen.getAllByText('Cloud provider').length).toBeGreaterThan(0);
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.queryByText('Granted')).not.toBeInTheDocument();
  });

  it('displays selected status filters only when status filters are present', () => {
    renderToolbar({
      selectedStatuses: ['Granted'],
    });

    expect(screen.getAllByText('Gold image access').length).toBeGreaterThan(0);
    expect(screen.getByText('Granted')).toBeInTheDocument();
    expect(screen.queryByText('AWS')).not.toBeInTheDocument();
  });

  it('updates the category toggle label after selecting Provider', () => {
    renderToolbar({ activeCategory: 'ID' });

    fireEvent.click(screen.getByRole('button', { name: /cloud account/i }));
    fireEvent.click(screen.getByText('Cloud provider'));

    expect(screen.getAllByText('Cloud provider').length).toBeGreaterThan(0);
  });

  it('updates the category toggle label after selecting Gold image access', () => {
    renderToolbar({ activeCategory: 'ID' });

    fireEvent.click(screen.getByRole('button', { name: /cloud account/i }));
    fireEvent.click(screen.getByText('Gold image access'));

    expect(
      screen.getByRole('button', { name: /^gold image access$/i }),
    ).toBeInTheDocument();
  });

  it('renders all filter category options in the dropdown when opened', () => {
    renderToolbar();

    fireEvent.click(screen.getByRole('button', { name: /cloud account/i }));

    expect(screen.getAllByText('Cloud account').length).toBeGreaterThan(0);
    expect(screen.getByText('Cloud provider')).toBeInTheDocument();
    expect(screen.getAllByText('Gold image access').length).toBeGreaterThan(0);
  });
});
