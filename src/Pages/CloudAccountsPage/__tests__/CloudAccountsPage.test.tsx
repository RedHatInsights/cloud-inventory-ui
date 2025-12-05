import { renderWithRouter } from '../../../utils/testing/customRender';
import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { CloudAccountsPage } from '../CloudAccountsPage';
import { ManipulatableQueryWrapper } from '../../../Components/util/testing/ManipulatableQueryWrapper';
import { useCloudAccounts } from '../../../hooks/api/useCloudAccounts';
import { useRbacPermission } from '../../../hooks/util/useRbacPermissions';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  Navigate: () => {
    mockNavigate();
    return <div data-testid="navigate" />;
  },
}));

jest.mock('../../../hooks/api/useCloudAccounts', () => ({
  useCloudAccounts: jest.fn(),
}));
jest.mock('../../../hooks/util/useRbacPermissions', () => ({
  useRbacPermission: jest.fn(),
}));
jest.mock('../../../Components/CloudAccounts/CloudAccountsTable', () => ({
  CloudAccountsTable: () => <div>Cloud Accounts Table</div>,
}));
jest.mock('../../../Components/CloudAccounts/CloudAccountsToolbar', () => ({
  CloudAccountsToolbar: () => <div>Cloud Accounts Toolbar</div>,
}));
jest.mock('../../../Components/CloudAccounts/CloudAccountsPagination', () => ({
  CloudAccountsPagination: () => <div>Pagination</div>,
}));
jest.mock('../../../Components/CloudAccounts/NoCloudAccounts', () => ({
  NoCloudAccounts: () => <div>No cloud accounts</div>,
}));
jest.mock('../../../Components/util/Loading', () => ({
  Loading: () => <div>Loading</div>,
}));
jest.mock('@redhat-cloud-services/frontend-components/Unavailable', () => ({
  Unavailable: () => <div>Unavailable</div>,
}));

const mockUseCloudAccounts = useCloudAccounts as jest.Mock;
const mockUseRbacPermission = useRbacPermission as jest.Mock;

const { ComponentWithQueryClient } = ManipulatableQueryWrapper(
  <CloudAccountsPage />
);
describe('Cloud accounts page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRbacPermission.mockReturnValue({
      data: { canReadCloudAccess: true },
      isLoading: false,
    });
  });
  it('renders page header', async () => {
    mockUseCloudAccounts.mockReturnValue({
      data: {
        body: [],
        pagination: { limit: 10, offset: 0, total: 0 },
      },
      isLoading: false,
      isError: false,
    });
    renderWithRouter(<ComponentWithQueryClient />);
    await waitFor(() =>
      expect(screen.getByText('Cloud Inventory')).toBeInTheDocument()
    );
  });
  it('shows loading while permissions are loading', async () => {
    mockUseRbacPermission.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    mockUseCloudAccounts.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    renderWithRouter(<ComponentWithQueryClient />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
  it('redirects when user lacks permission', async () => {
    mockUseRbacPermission.mockReturnValue({
      data: { canReadCloudAccess: false },
      isLoading: false,
    });
    mockUseCloudAccounts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
    renderWithRouter(<ComponentWithQueryClient />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
  it('shows loading while cloud accounts are loading', async () => {
    mockUseCloudAccounts.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    renderWithRouter(<ComponentWithQueryClient />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
  it('renders unavailable on API error', async () => {
    mockUseCloudAccounts.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderWithRouter(<ComponentWithQueryClient />);
    await waitFor(() =>
      expect(screen.getByText('Unavailable')).toBeInTheDocument()
    );
  });
  it('renders empty state when no cloud accounts exist', async () => {
    mockUseCloudAccounts.mockReturnValue({
      data: {
        body: [],
        pagination: { limit: 10, offset: 0, total: 0 },
      },
      isLoading: false,
      isError: false,
    });
    renderWithRouter(<ComponentWithQueryClient />);
    await waitFor(() =>
      expect(screen.getByText('No cloud accounts')).toBeInTheDocument()
    );
  });
  it('renders table, toolbar, and pagination when accounts exist', async () => {
    mockUseCloudAccounts.mockReturnValue({
      data: {
        body: [
          {
            providerAccountID: '123',
            shortName: 'aws',
            goldImageAccess: true,
            dateAdded: '2024-01-01',
          },
        ],
        pagination: { limit: 10, offset: 0, total: 1 },
      },
      isLoading: false,
      isError: false,
    });
    renderWithRouter(<ComponentWithQueryClient />);
    await waitFor(() => {
      expect(screen.getByText('Cloud Accounts Toolbar')).toBeInTheDocument();
      expect(screen.getByText('Cloud Accounts Table')).toBeInTheDocument();
      expect(screen.getByText('Pagination')).toBeInTheDocument();
    });
  });
});
