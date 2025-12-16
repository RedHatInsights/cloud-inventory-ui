import { renderHook, waitFor } from '@testing-library/react';
import { RequestMocks } from '../../../Components/util/testing/mockApiResponse';
import { useCloudAccounts } from '../useCloudAccounts';
import { CloudProviderShortname } from '../useCloudAccounts';
const mocks = new RequestMocks();
describe('useCloudAccounts', () => {
  beforeEach(() => {
    mocks.reset();
  });
  it('fetches cloud accounts with provided limit and offset', async () => {
    mocks.addMock(
      '/api/rhsm/v2/cloud_access_providers/accounts?limit=10&offset=0',
      {
        body: [
          {
            providerAccountID: '123',
            goldImageAccess: 'Granted',
            dateAdded: '2024-01-01',
            providerLabel: 'Amazon Web Services',
            shortName: CloudProviderShortname.AWS,
          },
        ],
        pagination: {
          count: 1,
          limit: 10,
          offset: 0,
          total: 1,
        },
      },
      true
    );
    const { result } = renderHook(
      () => useCloudAccounts({ limit: 10, offset: 0 }),
      { wrapper: mocks.wrapper }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.body).toHaveLength(1);
    expect(result.current.data?.pagination.total).toBe(1);
  });
  it('returns empty list when no cloud accounts exist', async () => {
    mocks.addMock(
      '/api/rhsm/v2/cloud_access_providers/accounts?limit=10&offset=0',
      {
        body: [],
        pagination: {
          count: 0,
          limit: 10,
          offset: 0,
          total: 0,
        },
      },
      true
    );
    const { result } = renderHook(
      () => useCloudAccounts({ limit: 10, offset: 0 }),
      { wrapper: mocks.wrapper }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.body).toEqual([]);
  });
  it('exposes pagination metadata from the API', async () => {
    mocks.addMock(
      '/api/rhsm/v2/cloud_access_providers/accounts?limit=5&offset=10',
      {
        body: [],
        pagination: {
          count: 5,
          limit: 5,
          offset: 10,
          total: 42,
        },
      },
      true
    );
    const { result } = renderHook(
      () => useCloudAccounts({ limit: 5, offset: 10 }),
      { wrapper: mocks.wrapper }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pagination.total).toBe(42);
  });
  it('enters error state on non-200 response', async () => {
    mocks.addMock(
      '/api/rhsm/v2/cloud_access_providers/accounts?limit=10&offset=0',
      {},
      false
    );
    const { result } = renderHook(
      () => useCloudAccounts({ limit: 10, offset: 0 }),
      { wrapper: mocks.wrapper }
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
  it('enters error state on network failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    ) as jest.Mock;
    const { result } = renderHook(
      () => useCloudAccounts({ limit: 10, offset: 0 }),
      { wrapper: mocks.wrapper }
    );
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
  it('starts in loading state', () => {
    mocks.addMock(
      '/api/rhsm/v2/cloud_access_providers/accounts?limit=10&offset=0',
      {},
      true
    );
    const { result } = renderHook(
      () => useCloudAccounts({ limit: 10, offset: 0 }),
      { wrapper: mocks.wrapper }
    );
    expect(result.current.isLoading).toBe(true);
  });
});
