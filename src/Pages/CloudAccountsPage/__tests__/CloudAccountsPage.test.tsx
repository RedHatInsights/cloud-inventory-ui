import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { CloudAccountsPage } from '../CloudAccountsPage';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { ManipulatableQueryWrapper } from '../../../Components/util/testing/ManipulatableQueryWrapper';
import { DefaultCloudAccountsSort } from '../../../state/cloudAccounts';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  Navigate: () => {
    mockNavigate();
    return <div data-testid="navigate" />;
  },
}));

const { ComponentWithQueryClient, queryClient } = ManipulatableQueryWrapper(
  <CloudAccountsPage />
);

beforeEach(() => {
  queryClient.clear();

  queryClient.setQueryData(['rbacPermissions'], {
    canReadCloudAccess: true,
  });
});
it('renders cloud accounts page', async () => {
  queryClient.setQueryData(
    [
      'cloudAccounts',
      {
        limit: 10,
        offset: 0,
        sortField: 'provider_account_id',
        sortDirection: DefaultCloudAccountsSort.direction,
      },
    ],
    {
      body: [
        {
          providerAccountID: 'abc',
          shortName: 'AWS',
          goldImageAccess: 'Granted',
          dateAdded: '2025-01-01',
        },
      ],
      pagination: {
        total: 1,
        count: 1,
        limit: 10,
        offset: 0,
      },
    }
  );

  renderWithRouter(<ComponentWithQueryClient />);

  await waitFor(() =>
    expect(screen.getByText('Cloud Accounts')).toBeInTheDocument()
  );
});

it('shows empty state when no accounts exist', async () => {
  queryClient.setQueryData(
    [
      'cloudAccounts',
      {
        limit: 10,
        offset: 0,
        sortField: 'provider_account_id',
        sortDirection: DefaultCloudAccountsSort.direction,
      },
    ],
    {
      body: [],
      pagination: {
        total: 1,
        count: 1,
        limit: 10,
        offset: 0,
      },
    }
  );
  renderWithRouter(<ComponentWithQueryClient />);

  const emptyStateText = await screen.findByText(/cloud accounts appear here/i);

  expect(emptyStateText).toBeInTheDocument();
});

it('shows loading state while cloud accounts are loading', async () => {
  queryClient.setQueryData(['rbacPermissions'], {
    canReadCloudAccess: true,
  });

  queryClient.setQueryDefaults(['cloudAccounts'], {
    queryFn: () => new Promise(() => {}),
  });

  renderWithRouter(<ComponentWithQueryClient />);

  expect(await screen.findByLabelText(/contents/i)).toBeInTheDocument();
});
it('redirects when user lacks permission', async () => {
  queryClient.setQueryData(['rbacPermissions'], {
    canReadCloudAccess: false,
  });

  renderWithRouter(<ComponentWithQueryClient />);

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalled();
  });
});
