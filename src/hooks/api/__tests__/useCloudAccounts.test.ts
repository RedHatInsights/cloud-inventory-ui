import { renderHook, waitFor } from '@testing-library/react';
import { RequestMocks } from '../../../Components/util/testing/mockApiResponse';
import { useCloudAccounts } from '../useCloudAccounts';

const mocks = new RequestMocks();
describe('Cloud Accounts hook', () => {
  beforeEach(() => mocks.reset());
  it('fetches cloud accounts successfully', async () => {
    mocks.addMock(
      '/api/rhsm/v2/cloud_access_providers/accounts',
      {
        body: [
          {
            providerAccountID: '123',
            goldImageAccess: 'Granted',
            dateAdded: '2024-01-01',
            shortName: 'AWS',
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
    const { result } = renderHook(() => useCloudAccounts(), {
      wrapper: mocks.wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.body).toHaveLength(1);
    expect(result.current.data?.body[0].providerAccountID).toBe('123');
  });

  it('handles empty cloud accounts response', async () => {
    mocks.addMock(
      '/api/rhsm/v2/cloud_access_providers/accounts',
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
    const { result } = renderHook(() => useCloudAccounts(), {
      wrapper: mocks.wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.body).toHaveLength(0);
  });

  it('handles http error response', async () => {
    mocks.addMock('/api/rhsm/v2/cloud_access_providers/accounts', {}, false);
    const { result } = renderHook(() => useCloudAccounts(), {
      wrapper: mocks.wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it('handles thrown network error', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    ) as jest.Mock;
    const { result } = renderHook(() => useCloudAccounts(), {
      wrapper: mocks.wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('starts in loading state', () => {
    mocks.addMock('/api/rhsm/v2/cloud_access_providers/accounts', {}, true);
    const { result } = renderHook(() => useCloudAccounts(), {
      wrapper: mocks.wrapper,
    });
    expect(result.current.isLoading).toBe(true);
  });
});
