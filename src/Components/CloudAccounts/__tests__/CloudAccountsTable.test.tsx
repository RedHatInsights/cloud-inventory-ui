import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { CloudAccountsTable, mapField } from '../CloudAccountsTable';
import {
  CloudAccount,
  CloudProviderShortname,
} from '../../../hooks/api/useCloudAccounts';
import {
  CloudAccountsPaginationData,
  DefaultCloudAccountsSort,
} from '../../../state/cloudAccounts';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { renderWithRouter } from '../../../utils/testing/customRender';

jest.mock('../../../Components/CloudAccounts/GetStatusIcon', () => ({
  getStatusIcon: () => <span data-testid="status-icon" />,
}));
jest.mock('../../../hooks/util/dates', () => ({
  formatDate: (d: string) => `Formatted:${d}`,
}));
const makeAccounts = (count: number): CloudAccount[] =>
  Array.from({ length: count }).map((_, i) => ({
    providerAccountID: `acct-${i}`,
    shortName:
      i % 2 === 0 ? CloudProviderShortname.AWS : CloudProviderShortname.GCP,
    providerLabel: i % 2 === 0 ? 'AWS' : 'Google Cloud',
    goldImageAccess: i % 2 === 0 ? 'Granted' : 'Failed',
    dateAdded: `2024-01-${String(i + 1).padStart(2, '0')}`,
  }));

const originalEnv = process.env.NODE_ENV;

const renderTable = (
  accounts: CloudAccount[],
  sort = DefaultCloudAccountsSort,
  onSortChange = jest.fn()
) =>
  renderWithRouter(
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
        sort={sort}
        onSortChange={onSortChange}
      />
    </HydrateAtomsTestProvider>
  );
describe('CloudAccountsTable', () => {
  it('renders the table', () => {
    renderTable(makeAccounts(3));
    expect(
      screen.getByRole('grid', { name: /cloud accounts table/i })
    ).toBeInTheDocument();
  });
  it('emits sort change when clicking Cloud account column', () => {
    const onSortChange = jest.fn();
    renderTable(makeAccounts(3), DefaultCloudAccountsSort, onSortChange);
    fireEvent.click(screen.getByRole('button', { name: /cloud account/i }));
    expect(onSortChange).toHaveBeenCalledWith({
      field: 'providerAccountID',
      direction: 'desc',
    });
  });
  it('emits correct field when clicking Cloud provider column', () => {
    const onSortChange = jest.fn();
    renderTable(makeAccounts(3), DefaultCloudAccountsSort, onSortChange);
    fireEvent.click(screen.getByRole('button', { name: /cloud provider/i }));
    expect(onSortChange).toHaveBeenCalledWith({
      field: 'provider',
      direction: 'asc',
    });
  });
  it('renders provider link with cloudProvider query param', () => {
    renderTable(makeAccounts(1));
    const link = screen.getByRole('link', { name: 'AWS' });
    const url = new URL(link.getAttribute('href')!, 'http://localhost');
    const param = url.searchParams.get('cloudProvider');
    expect(JSON.parse(decodeURIComponent(param!))).toEqual(['AWS']);
  });
  it('renders gold image status and icon', () => {
    renderTable(makeAccounts(1));
    expect(screen.getByText('Granted')).toBeInTheDocument();
    expect(screen.getByTestId('status-icon')).toBeInTheDocument();
  });
  it('renders formatted date (development sorting path)', () => {
    process.env.NODE_ENV = 'development';

    renderTable(makeAccounts(2), {
      field: 'providerAccountID',
      direction: 'asc',
    });

    expect(screen.getAllByText(/Formatted:/)).toHaveLength(2);

    process.env.NODE_ENV = originalEnv;
  });

  it('renders cloud account ID as a link', () => {
    renderTable(makeAccounts(1));
    expect(screen.getByText('acct-0').closest('a')).toBeTruthy();
  });
  it('renders View Purchases action', () => {
    renderTable(makeAccounts(2));
    expect(screen.getAllByText('View Purchases')).toHaveLength(2);
  });

  describe('mapField', () => {
    it('maps providerAccountID to id', () => {
      expect(mapField('providerAccountID')).toBe('id');
    });

    it('maps provider to provider', () => {
      expect(mapField('provider')).toBe('provider');
    });

    it('maps goldImageAccess to goldImage', () => {
      expect(mapField('goldImageAccess')).toBe('goldImage');
    });

    it('maps dateAdded to date', () => {
      expect(mapField('dateAdded')).toBe('date');
    });
  });

  describe('onColumnSort behavior', () => {
    it('emits correct sort field and direction when clicking Cloud account column', () => {
      const onSortChange = jest.fn();
      renderTable(makeAccounts(3), DefaultCloudAccountsSort, onSortChange);
      fireEvent.click(screen.getByRole('button', { name: /cloud account/i }));
      expect(onSortChange).toHaveBeenCalledWith({
        field: 'providerAccountID',
        direction: 'desc',
      });
    });
    it('emits correct sort field when clicking Cloud provider column', () => {
      const onSortChange = jest.fn();
      renderTable(makeAccounts(3), DefaultCloudAccountsSort, onSortChange);
      fireEvent.click(screen.getByRole('button', { name: /cloud provider/i }));
      expect(onSortChange).toHaveBeenCalledWith({
        field: 'provider',
        direction: 'asc',
      });
    });
    it('emits correct sort field when clicking Gold image access column', () => {
      const onSortChange = jest.fn();
      renderTable(makeAccounts(3), DefaultCloudAccountsSort, onSortChange);
      fireEvent.click(
        screen.getByRole('button', { name: /gold image access/i })
      );
      expect(onSortChange).toHaveBeenCalledWith({
        field: 'goldImageAccess',
        direction: 'asc',
      });
    });
    it('emits correct sort field when clicking Date added column', () => {
      const onSortChange = jest.fn();
      renderTable(makeAccounts(3), DefaultCloudAccountsSort, onSortChange);
      fireEvent.click(screen.getByRole('button', { name: /date added/i }));
      expect(onSortChange).toHaveBeenCalledWith({
        field: 'dateAdded',
        direction: 'asc',
      });
    });
    it('does nothing when clicking a non-sortable column', () => {
      const onSortChange = jest.fn();
      renderTable(makeAccounts(3), DefaultCloudAccountsSort, onSortChange);
      fireEvent.click(screen.getByRole('columnheader', { name: /actions/i }));
      expect(onSortChange).not.toHaveBeenCalled();
    });
  });

  describe('onColumnSort behavior', () => {
    it('calls onSortChange with correct field and direction', () => {
      const onSortChange = jest.fn();
      renderTable(makeAccounts(3), DefaultCloudAccountsSort, onSortChange);
      fireEvent.click(screen.getByRole('button', { name: /cloud account/i }));
      expect(onSortChange).toHaveBeenCalledWith({
        field: 'providerAccountID',
        direction: 'desc',
      });
    });

    it('uses the correct column index to determine sortField', () => {
      const onSortChange = jest.fn();
      renderTable(makeAccounts(3), DefaultCloudAccountsSort, onSortChange);
      fireEvent.click(screen.getByRole('button', { name: /cloud provider/i }));
      expect(onSortChange).toHaveBeenCalledWith({
        field: 'provider',
        direction: 'asc',
      });
    });

    it('does not call onSortChange if column has no sortField', () => {
      const onSortChange = jest.fn();
      renderTable(makeAccounts(3), DefaultCloudAccountsSort, onSortChange);
      const headers = screen.getAllByRole('columnheader');
      const actionsHeader = headers[headers.length - 1];
      fireEvent.click(actionsHeader);
      expect(onSortChange).not.toHaveBeenCalled();
    });

    it('passes direction through unchanged', () => {
      const onSortChange = jest.fn();
      renderTable(
        makeAccounts(3),
        {
          field: 'providerAccountID',
          direction: 'desc',
        },
        onSortChange
      );
      fireEvent.click(screen.getByRole('button', { name: /cloud account/i }));
      expect(onSortChange).toHaveBeenCalledWith({
        field: 'providerAccountID',
        direction: 'asc',
      });
    });
  });
  it('does not call onSortChange when column has no sortField', () => {
    const onSortChange = jest.fn();
    renderTable(makeAccounts(2), DefaultCloudAccountsSort, onSortChange);

    fireEvent.click(screen.getByRole('columnheader', { name: /actions/i }));

    expect(onSortChange).not.toHaveBeenCalled();
  });
});
