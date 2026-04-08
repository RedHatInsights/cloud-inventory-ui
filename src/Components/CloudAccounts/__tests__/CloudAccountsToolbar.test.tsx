import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { useAtomValue } from 'jotai';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { CloudAccountsToolbar } from '../CloudAccountsToolbar';
import {
  cloudAccountIDFilterData,
  cloudAccountsFilterCategoryData,
  cloudProviderFilterData,
  goldImageStatusFilterData,
} from '../../../state/cloudAccounts';
import { CloudProviderShortname } from '../../../hooks/api/useCloudAccounts';

jest.mock('../CloudAccountIDFilter', () => ({
  CloudAccountIDFilter: () => (
    <div data-testid="cloud-account-id-filter">ID Filter</div>
  ),
}));

jest.mock('../GoldImageAccessFilter', () => ({
  GoldImageAccessFilter: ({
    availableStatuses,
  }: {
    availableStatuses: string[];
  }) => (
    <div data-testid="gold-image-access-filter">
      Status Filter: {availableStatuses.join(',')}
    </div>
  ),
}));

jest.mock('../CloudAccountsPagination', () => ({
  CloudAccountsPagination: () => (
    <div data-testid="cloud-accounts-pagination">Pagination</div>
  ),
}));

jest.mock('../../shared/CloudProviderSharedFilterSelect', () => ({
  CloudProviderSharedFilterSelect: ({
    selectOptions,
  }: {
    selectOptions: string[];
  }) => (
    <div data-testid="cloud-provider-filter-select">
      Provider Filter: {selectOptions.join(',')}
    </div>
  ),
}));

jest.mock('../../shared/CloudProviderSharedFilterList', () => ({
  CloudProviderSharedFilterList: ({ filterAtom }: { filterAtom: unknown }) => {
    const providerValues = useAtomValue(cloudProviderFilterData);
    const statusValues = useAtomValue(goldImageStatusFilterData);

    const values =
      filterAtom === cloudProviderFilterData
        ? providerValues
        : filterAtom === goldImageStatusFilterData
          ? statusValues
          : [];

    return (
      <div data-testid="cloud-provider-shared-filter-list">
        {values.map((value: string) => (
          <span key={value}>{value}</span>
        ))}
      </div>
    );
  },
}));

const renderToolbar = ({
  selectedID = '',
  selectedProviders = [],
  selectedStatuses = [],
  activeCategory = 'ID',
  onClearAll = jest.fn(),
}: {
  selectedID?: string;
  selectedProviders?: string[];
  selectedStatuses?: string[];
  activeCategory?: 'ID' | 'Provider' | 'Status';
  onClearAll?: jest.Mock;
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
        onClearAll={onClearAll}
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
      screen.getByRole('button', { name: /cloud account/i }),
    ).toBeInTheDocument();
  });

  it('displays selected ID filter', () => {
    renderToolbar({ selectedID: 'acct-123' });

    expect(screen.getByText('acct-123')).toBeInTheDocument();
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

  it('calls onClearAll when clear all is clicked', () => {
    const onClearAll = jest.fn();

    renderToolbar({
      selectedProviders: [CloudProviderShortname.AWS],
      onClearAll,
    });

    fireEvent.click(screen.getByRole('button', { name: /clear all filters/i }));

    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('removes selected ID when label close button is clicked', () => {
    renderToolbar({ selectedID: 'acct-123' });

    expect(screen.getByText('acct-123')).toBeInTheDocument();

    const idCloseButton = screen
      .getAllByRole('button')
      .find((button) => button.getAttribute('aria-label')?.match(/close/i));

    if (!idCloseButton) {
      throw new Error('Expected label close button to exist');
    }

    fireEvent.click(idCloseButton);

    expect(screen.queryByText('acct-123')).not.toBeInTheDocument();
  });

  it('switches to provider filter when Cloud provider category is selected', () => {
    renderToolbar({ activeCategory: 'ID' });

    const categoryToggle = screen.getByRole('button', {
      name: /cloud account|cloud provider|gold image access/i,
    });

    fireEvent.click(categoryToggle);
    fireEvent.click(screen.getByText('Cloud provider'));

    expect(
      screen.getByTestId('cloud-provider-filter-select'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('cloud-account-id-filter'),
    ).not.toBeInTheDocument();
  });

  it('switches to status filter when Gold image access category is selected', () => {
    renderToolbar({ activeCategory: 'ID' });

    const categoryToggle = screen.getByRole('button', {
      name: /cloud account|cloud provider|gold image access/i,
    });

    fireEvent.click(categoryToggle);
    fireEvent.click(screen.getByText('Gold image access'));

    expect(screen.getByTestId('gold-image-access-filter')).toBeInTheDocument();
    expect(
      screen.queryByTestId('cloud-account-id-filter'),
    ).not.toBeInTheDocument();
  });

  it('displays selected provider and status filters', () => {
    renderToolbar({
      selectedProviders: [CloudProviderShortname.AWS],
      selectedStatuses: ['Granted'],
    });

    expect(screen.getByText(CloudProviderShortname.AWS)).toBeInTheDocument();
    expect(screen.getByText('Granted')).toBeInTheDocument();
  });
});
