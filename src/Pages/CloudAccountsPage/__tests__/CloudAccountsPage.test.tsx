import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { CloudAccountsPage } from '../CloudAccountsPage';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { ManipulatableQueryWrapper } from '../../../Components/util/testing/ManipulatableQueryWrapper';

const mockNavigate = jest.fn();

jest.mock('@project-kessel/react-kessel-access-check', () => ({
  fetchDefaultWorkspace: jest.fn(() => Promise.resolve({ id: 'org-id' })),
  useAccessCheckContext: jest.fn(() => ({})),
}));

jest.mock('@project-kessel/react-kessel-access-check/core/api-client', () => ({
  checkSelf: (...args: unknown[]) => mockNavigate(...args),
}));

const defaultQueryParams = {
  limit: 10,
  offset: 0,
  sortField: undefined,
  sortDirection: undefined,
  shortName: [],
  goldImageAccess: [],
  providerAccountID: '',
};

const { ComponentWithQueryClient, queryClient } = ManipulatableQueryWrapper(
  <CloudAccountsPage />,
);

beforeEach(() => {
  queryClient.clear();

  mockNavigate.mockResolvedValue({
    allowed: 'ALLOWED_TRUE',
  });
});

afterEach(() => {
  queryClient.clear();
  jest.clearAllMocks();
});

it('renders cloud accounts page', async () => {
  queryClient.setQueryData(['cloudAccounts', defaultQueryParams], {
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
  });

  renderWithRouter(<ComponentWithQueryClient />);

  expect(await screen.findByText('Cloud Accounts')).toBeInTheDocument();
});

it('shows empty state when no accounts exist', async () => {
  queryClient.setQueryData(['cloudAccounts', defaultQueryParams], {
    body: [],
    pagination: { total: 0, count: 0, limit: 10, offset: 0 },
  });

  renderWithRouter(<ComponentWithQueryClient />);

  const integrationsLink = await screen.findByRole('link', {
    name: /integrations/i,
  });

  expect(integrationsLink).toHaveAttribute('href', '/settings/integrations/');
});

it('shows loading state while cloud accounts are loading', async () => {
  queryClient.setQueryDefaults(['cloudAccounts'], {
    queryFn: () => new Promise(() => {}),
  });

  renderWithRouter(<ComponentWithQueryClient />);

  expect(await screen.findByLabelText(/contents/i)).toBeInTheDocument();
});

it('redirects when user lacks permission', async () => {
  mockNavigate.mockResolvedValueOnce({
    allowed: 'ALLOWED_FALSE',
  });

  renderWithRouter(<ComponentWithQueryClient />);

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalled();
  });
});
