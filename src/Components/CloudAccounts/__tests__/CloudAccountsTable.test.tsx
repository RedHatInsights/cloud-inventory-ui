import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { CloudAccountsTable } from '../CloudAccountsTable';
import {
  CloudAccount,
  CloudProviderShortname,
} from '../../../hooks/api/useCloudAccounts';
import {
  CloudAccountsPaginationData,
  DefaultCloudAccountsSort,
} from '../../../state/cloudAccounts';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';

jest.mock('../../../Components/CloudAccounts/GetStatusIcon', () => ({
  getStatusIcon: () => <span data-testid="status-icon" />,
  toCloudAccountStatus: (v: string) => v,
}));
jest.mock('../../../hooks/util/dates', () => ({
  formatDate: (d: string) => `Formatted:${d}`,
}));

const makeAccounts = (count: number): CloudAccount[] =>
  Array.from({ length: count }).map((_, i) => {
    const shortName =
      i % 2 === 0 ? CloudProviderShortname.AWS : CloudProviderShortname.GCP;

    return {
      providerAccountID: `acct-${i}`,
      shortName,
      providerLabel:
        shortName === CloudProviderShortname.AWS ? 'AWS' : 'Google Cloud',
      goldImageAccess: i % 2 === 0 ? 'Granted' : 'Failed',
      dateAdded: `2024-01-${String(i + 1).padStart(2, '0')}`,
    };
  });

const renderTable = (accounts: CloudAccount[]) => {
  const onSortChange = jest.fn();
  return renderWithRouter(
    <HydrateAtomsTestProvider
      initialValues={[
        [
          CloudAccountsPaginationData,
          { page: 1, perPage: 10, itemCount: accounts.length },
        ],
      ]}
    >
      <CloudAccountsTable
        cloudAccounts={accounts}
        sort={DefaultCloudAccountsSort}
        onSortChange={onSortChange}
      />
    </HydrateAtomsTestProvider>
  );
};

describe('CloudAccountsTable', () => {
  it('renders', () => {
    const accounts = makeAccounts(12);
    const { container } = renderTable(accounts);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('sorts by cloud account ID when clicking header', async () => {
    const accounts = makeAccounts(3);
    const { container } = renderTable(accounts);
    const sortButton = container.querySelector('th button');
    fireEvent.click(sortButton!);
    await waitFor(() => {
      const firstCell =
        container.querySelector('tbody tr td')?.textContent ?? '';
      expect(firstCell).toBe('acct-2');
    });
    fireEvent.click(sortButton!);
    await waitFor(() => {
      const firstCell =
        container.querySelector('tbody tr td')?.textContent ?? '';
      expect(firstCell).toBe('acct-0');
    });
  });

  it('renders provider link with cloudProvider query param', () => {
    const accounts = makeAccounts(1);
    const { container } = renderTable(accounts);

    const link = container.querySelector(
      'tbody tr td:nth-child(2) a'
    ) as HTMLAnchorElement;

    expect(link).toBeTruthy();

    const url = new URL(link.getAttribute('href')!, 'http://localhost');

    const value = url.searchParams.get('cloudProvider');
    expect(value).not.toBeNull();

    const decoded = JSON.parse(decodeURIComponent(value!));
    expect(decoded).toEqual(['AWS']);
  });

  it('renders gold image access text and status icon', () => {
    const accounts = makeAccounts(1);
    const { getByText, getByTestId } = renderTable(accounts);
    expect(getByText('Granted')).toBeInTheDocument();
    expect(getByTestId('status-icon')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    const accounts = makeAccounts(1);
    const { getByText } = renderTable(accounts);
    expect(getByText(/Formatted:/)).toBeInTheDocument();
  });

  it('renders cloud account ID as a link', () => {
    const accounts = makeAccounts(1);
    const { getByText } = renderTable(accounts);
    const link = getByText('acct-0').closest('a');
    expect(link).toBeTruthy();
  });

  it('renders View Purchases link', () => {
    const accounts = makeAccounts(2);
    const { getAllByText } = renderTable(accounts);
    expect(getAllByText('View Purchases').length).toBe(2);
  });
});
