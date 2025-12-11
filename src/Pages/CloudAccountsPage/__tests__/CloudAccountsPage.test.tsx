import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { CloudAccountsPage } from '../CloudAccountsPage';
import { ManipulatableQueryWrapper } from '../../../Components/util/testing/ManipulatableQueryWrapper';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  Navigate: () => {
    mockNavigate();
    return <div data-testid="navigate" />;
  },
}));
jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: () => ({ page: 1, perPage: 10 }),
}));

const { ComponentWithQueryClient, queryClient } = ManipulatableQueryWrapper(
  <CloudAccountsPage />
);

describe('CloudAccountsPage', () => {
  beforeEach(() => {
    queryClient.clear();
    queryClient.setQueryData(['rbacPermissions'], {
      canReadCloudAccess: true,
    });
    queryClient.setQueryData(['cloudAccounts'], {
      body: [],
    });
    mockNavigate.mockClear();
  });

  it('renders page header', async () => {
    renderWithRouter(<ComponentWithQueryClient />);
    await waitFor(() => {
      expect(screen.getByText('Cloud Inventory')).toBeInTheDocument();
    });
  });

  it('redirects if user lacks permissions', async () => {
    queryClient.setQueryData(['rbacPermissions'], {
      canReadCloudAccess: false,
    });
    renderWithRouter(<ComponentWithQueryClient />);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });

  it('renders empty state when no cloud accounts exist', async () => {
    queryClient.setQueryData(['cloudAccounts'], {
      body: [],
    });
    renderWithRouter(<ComponentWithQueryClient />);
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /cloud accounts/i })
      ).toBeInTheDocument()
    );
  });
});
