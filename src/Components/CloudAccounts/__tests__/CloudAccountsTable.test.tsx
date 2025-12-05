import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { CloudAccountsTable } from '../CloudAccountsTable';
import { CloudAccount } from '../../../hooks/api/useCloudAccounts';
import {
  cloudAccountsAccountFilterData,
  cloudAccountsGoldImageFilterData,
  cloudAccountsProviderFilterData,
} from '../../../state/cloudAccounts';
import { PROVIDER_MAP } from '../CloudAccountsUtils';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';

const cloudAccountsTestData = (amount: number): CloudAccount[] => {
  const data: CloudAccount[] = [];
  for (let i = 0; i < amount; i++) {
    data.push({
      providerAccountID: `acct-${i}`,
      goldImageAccess: i % 2 === 0 ? 'Granted' : 'Requested',
      dateAdded: `2024-01-${(i + 1).toString().padStart(2, '0')}`,
      shortName: i % 2 === 0 ? 'AWS' : 'GCE',
    });
  }
  return data;
};
describe('Cloud accounts table', () => {
  it('renders', () => {
    const { container } = renderWithRouter(
      <CloudAccountsTable cloudAccounts={cloudAccountsTestData(3)} />
    );
    expect(container.querySelector('table')).toBeInTheDocument();
  });
  it('sorts by cloud account when header is clicked', async () => {
    const accounts = cloudAccountsTestData(3);
    const sortedById = [...accounts].sort((a, b) =>
      a.providerAccountID.localeCompare(b.providerAccountID)
    );
    const { container } = renderWithRouter(
      <CloudAccountsTable cloudAccounts={accounts} />
    );
    const sortButton = container.querySelector('button');
    if (!sortButton) {
      throw new Error('Sort button not found');
    }
    fireEvent.click(sortButton);
    await waitFor(() => {
      expect(
        container.querySelector('tbody')?.firstChild?.firstChild?.firstChild
          ?.textContent
      ).toBe(sortedById[sortedById.length - 1].providerAccountID);
    });
    fireEvent.click(sortButton);
    await waitFor(() => {
      expect(
        container.querySelector('tbody')?.firstChild?.firstChild?.firstChild
          ?.textContent
      ).toBe(sortedById[0].providerAccountID);
    });
  });
  it('applies cloud account text filter', () => {
    const accounts = cloudAccountsTestData(3);
    const targetId = accounts[1].providerAccountID;
    const { container } = renderWithRouter(
      <HydrateAtomsTestProvider
        initialValues={[[cloudAccountsAccountFilterData, [targetId]]]}
      >
        <CloudAccountsTable cloudAccounts={accounts} />
      </HydrateAtomsTestProvider>
    );
    expect(container.querySelector('tbody')?.childNodes.length).toBe(1);
    expect(
      container.querySelector('tbody')?.firstChild?.firstChild?.firstChild
        ?.textContent
    ).toBe(targetId);
  });
  it('applies cloud provider filter', () => {
    const accounts: CloudAccount[] = [
      {
        providerAccountID: 'acct-aws',
        goldImageAccess: 'Granted',
        dateAdded: '2024-01-01',
        shortName: 'AWS',
      },
      {
        providerAccountID: 'acct-gce',
        goldImageAccess: 'Requested',
        dateAdded: '2024-01-02',
        shortName: 'GCE',
      },
    ];
    const providerLabel = PROVIDER_MAP['AWS'];
    const { container } = renderWithRouter(
      <HydrateAtomsTestProvider
        initialValues={[[cloudAccountsProviderFilterData, [providerLabel]]]}
      >
        <CloudAccountsTable cloudAccounts={accounts} />
      </HydrateAtomsTestProvider>
    );
    expect(container.querySelector('tbody')?.childNodes.length).toBe(1);
    expect(
      container.querySelector('tbody')?.firstChild?.firstChild?.firstChild
        ?.textContent
    ).toBe('acct-aws');
  });
  it('applies gold image access filter', () => {
    const accounts: CloudAccount[] = [
      {
        providerAccountID: 'acct-1',
        goldImageAccess: 'Granted',
        dateAdded: '2024-01-01',
        shortName: 'AWS',
      },
      {
        providerAccountID: 'acct-2',
        goldImageAccess: 'Requested',
        dateAdded: '2024-01-02',
        shortName: 'GCE',
      },
    ];

    const { container } = renderWithRouter(
      <HydrateAtomsTestProvider
        initialValues={[[cloudAccountsGoldImageFilterData, ['Requested']]]}
      >
        <CloudAccountsTable cloudAccounts={accounts} />
      </HydrateAtomsTestProvider>
    );

    expect(container.querySelector('tbody')?.childNodes.length).toBe(1);
    expect(screen.getByText('acct-2')).toBeInTheDocument();
  });
});
