import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { useAtomValue } from 'jotai';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { CloudAccountsFilterList } from '../CloudAccountsFilterList';
import {
  cloudAccountIDFilterData,
  cloudProviderFilterData,
  goldImageStatusFilterData,
} from '../../../state/cloudAccounts';
import { CloudProviderShortname } from '../../../types/cloudAccountsTypes';

const StateObserver = () => {
  const selectedID = useAtomValue(cloudAccountIDFilterData);
  const selectedProviders = useAtomValue(cloudProviderFilterData);
  const selectedStatuses = useAtomValue(goldImageStatusFilterData);

  return (
    <div>
         <div data-testid="selected-id">{selectedID}</div>
      <div data-testid="selected-providers">
        {JSON.stringify(selectedProviders)}
      </div>
      <div data-testid="selected-statuses">
        {JSON.stringify(selectedStatuses)}
      </div>
    </div>
  );
};

const renderFilterList = ({
  selectedID = '',
  selectedProviders = [],
  selectedStatuses = [],
}: {
  selectedID?: string;
  selectedProviders?: string[];
  selectedStatuses?: string[];
} = {}) =>
  renderWithRouter(
    <HydrateAtomsTestProvider
      initialValues={[
        [cloudAccountIDFilterData, selectedID],
        [cloudProviderFilterData, selectedProviders],
        [goldImageStatusFilterData, selectedStatuses],
      ]}
    >
      <CloudAccountsFilterList />
      <StateObserver />
    </HydrateAtomsTestProvider>,
  );

beforeEach(() => {
  window.history.pushState({}, '', '/');
});

describe('CloudAccountsFilterList', () => {
  it('renders nothing filter-related when no filters are active', () => {
    renderFilterList();

    expect(
      screen.queryByRole('button', { name: /clear all filters/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Cloud account')).not.toBeInTheDocument();
    expect(screen.queryByText('Cloud provider')).not.toBeInTheDocument();
    expect(screen.queryByText('Gold image access')).not.toBeInTheDocument();
  });

  it('renders selected provider filters using display labels', () => {
    renderFilterList({
      selectedProviders: [
        CloudProviderShortname.AWS,
        CloudProviderShortname.GCP,
      ],
    });

    expect(screen.getByText('Cloud provider')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Google Compute Engine')).toBeInTheDocument();
  });

  it('renders selected status filters', () => {
    renderFilterList({
      selectedStatuses: ['Granted', 'Failed'],
    });

    expect(screen.getByText('Gold image access')).toBeInTheDocument();
    expect(screen.getByText('Granted')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('removes the selected cloud account when its label is closed', () => {
    renderFilterList({ selectedID: 'acct-123' });

    const closeButtons = screen
      .getAllByRole('button')
      .filter((button) =>
        button.getAttribute('aria-label')?.toLowerCase().includes('close'),
      );

    expect(closeButtons.length).toBeGreaterThan(0);

    fireEvent.click(closeButtons[0]);

    expect(screen.queryByText('acct-123')).not.toBeInTheDocument();
    expect(screen.getByTestId('selected-id')).toHaveTextContent('');
  });

  it('clears all active filters when clear all filters is clicked', () => {
    renderFilterList({
      selectedID: 'acct-123',
      selectedProviders: [CloudProviderShortname.AWS],
      selectedStatuses: ['Granted'],
    });

    fireEvent.click(screen.getByRole('button', { name: /clear all filters/i }));

    expect(screen.queryByText('acct-123')).not.toBeInTheDocument();
    expect(screen.queryByText('AWS')).not.toBeInTheDocument();
    expect(screen.queryByText('Granted')).not.toBeInTheDocument();

    expect(screen.getByTestId('selected-id')).toHaveTextContent('');
    expect(screen.getByTestId('selected-providers')).toHaveTextContent('[]');
    expect(screen.getByTestId('selected-statuses')).toHaveTextContent('[]');
  });

  it('keeps clear all filters hidden after the last active filter is removed', () => {
    renderFilterList({ selectedID: 'acct-123' });

    const closeButtons = screen
      .getAllByRole('button')
      .filter((button) =>
        button.getAttribute('aria-label')?.toLowerCase().includes('close'),
      );

    fireEvent.click(closeButtons[0]);

    expect(
      screen.queryByRole('button', { name: /clear all filters/i }),
    ).not.toBeInTheDocument();
  });
});
