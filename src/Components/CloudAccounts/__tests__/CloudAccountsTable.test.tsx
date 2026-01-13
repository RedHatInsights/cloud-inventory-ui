import React, { useEffect, useState } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { CloudAccountsTable, mapField } from '../CloudAccountsTable';
import {
  CloudAccount,
  CloudProviderShortname,
} from '../../../hooks/api/useCloudAccounts';
import { CloudAccountsPaginationData } from '../../../state/cloudAccounts';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { SortByDirection } from '@patternfly/react-table';

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

const TestTableComponent = ({ accounts }: { accounts: CloudAccount[] }) => {
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState(SortByDirection.asc);
  const [stateAccounts, setAccounts] = useState(accounts);

  useEffect(() => {
    if (sortBy != '')
      setAccounts(
        stateAccounts.sort((a, b) => {
          const result = a[sortBy as keyof CloudAccount].localeCompare(
            b[sortBy as keyof CloudAccount],
          );

          return sortDir == SortByDirection.asc ? result : result * -1;
        }),
      );
  }, [sortBy, sortDir]);

  return (
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
        setSortBy={setSortBy}
        sortBy={sortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
      />
    </HydrateAtomsTestProvider>
  );
};

const renderTable = (accounts: CloudAccount[]) =>
  renderWithRouter(<TestTableComponent accounts={accounts} />);

describe('CloudAccountsTable', () => {
  it('renders the table', () => {
    renderTable(makeAccounts(3));
    expect(
      screen.getByRole('grid', { name: /cloud accounts table/i }),
    ).toBeInTheDocument();
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
    renderTable(makeAccounts(2));
    expect(screen.getAllByText(/Formatted:/)).toHaveLength(2);
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

  describe('column sorts', () => {
    it('by cloud account id', () => {
      const { container } = renderTable(makeAccounts(3));
      fireEvent.click(screen.getByRole('button', { name: /cloud account/i }));
      expect(
        String(
          container.querySelector('tbody')?.firstChild?.childNodes[0]
            .textContent,
        ),
      ).toBe('acct-0');

      // flip
      fireEvent.click(screen.getByRole('button', { name: /cloud account/i }));
      expect(
        String(
          container.querySelector('tbody')?.firstChild?.childNodes[0]
            .textContent,
        ),
      ).toBe('acct-2');
    });

    it('by cloud provider', () => {
      const { container } = renderTable(makeAccounts(3));
      fireEvent.click(screen.getByRole('button', { name: /cloud provider/i }));
      expect(
        String(
          container.querySelector('tbody')?.firstChild?.childNodes[1]
            .textContent,
        ),
      ).toBe('AWS');

      // flip
      fireEvent.click(screen.getByRole('button', { name: /cloud provider/i }));
      expect(
        String(
          container.querySelector('tbody')?.firstChild?.childNodes[1]
            .textContent,
        ),
      ).toBe('Google Compute Engine');
    });

    it('by gold image', () => {
      const { container } = renderTable(makeAccounts(3));
      fireEvent.click(
        screen.getByRole('button', { name: /gold image access/i }),
      );
      expect(
        String(
          container.querySelector('tbody')?.firstChild?.childNodes[2]
            .textContent,
        ),
      ).toBe('Failed');

      // flip
      fireEvent.click(
        screen.getByRole('button', { name: /gold image access/i }),
      );
      expect(
        String(
          container.querySelector('tbody')?.firstChild?.childNodes[2]
            .textContent,
        ),
      ).toBe('Granted');
    });

    it('by date added', () => {
      const { container } = renderTable(makeAccounts(3));
      fireEvent.click(screen.getByRole('button', { name: /date added/i }));
      expect(
        String(
          container.querySelector('tbody')?.firstChild?.childNodes[3]
            .textContent,
        ),
      ).toBe('Formatted:2024-01-01');

      // flip
      fireEvent.click(screen.getByRole('button', { name: /date added/i }));
      expect(
        String(
          container.querySelector('tbody')?.firstChild?.childNodes[3]
            .textContent,
        ),
      ).toBe('Formatted:2024-01-03');
    });
  });
});
