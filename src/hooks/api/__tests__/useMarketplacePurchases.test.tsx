import { renderHook, waitFor } from '@testing-library/react';
import { RequestMocks } from '../../../Components/util/testing/mockApiResponse';
import { useMarketplacePurchases } from '../useMarketplacePurchases';

const mocks = new RequestMocks();

const marketplacePurchasesUrl =
  '/api/rhsm/v2/cloud_access_providers/marketplace_purchases';

describe('useMarketplacePurchases', () => {
  beforeEach(() => {
    mocks.reset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches marketplace purchases', async () => {
    mocks.addMock(
      marketplacePurchasesUrl,
      {
        body: [
          {
            offeringName: 'Red Hat Enterprise Linux',
            marketplaceAccount: '123456789',
            marketplace: 'aws_marketplace',
            startDate: '2026-07-13T00:00:00Z',
            skus: ['RH02612'],
          },
        ],
        pagination: {
          count: 1,
          limit: 10,
          offset: 0,
          total: 1,
        },
      },
      true,
    );

    const { result } = renderHook(() => useMarketplacePurchases(), {
      wrapper: mocks.wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.body).toHaveLength(1);
    expect(result.current.data?.body[0].offeringName).toBe(
      'Red Hat Enterprise Linux',
    );
    expect(result.current.data?.pagination.total).toBe(1);
  });

  it('returns an empty list when no marketplace purchases exist', async () => {
    mocks.addMock(
      marketplacePurchasesUrl,
      {
        body: [],
        pagination: {
          count: 0,
          limit: 10,
          offset: 0,
          total: 0,
        },
      },
      true,
    );

    const { result } = renderHook(() => useMarketplacePurchases(), {
      wrapper: mocks.wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.body).toEqual([]);
    expect(result.current.data?.pagination.total).toBe(0);
  });

  it('exposes pagination metadata returned by the API', async () => {
    mocks.addMock(
      marketplacePurchasesUrl,
      {
        body: [],
        pagination: {
          count: 5,
          limit: 10,
          offset: 0,
          total: 42,
        },
      },
      true,
    );

    const { result } = renderHook(() => useMarketplacePurchases(), {
      wrapper: mocks.wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pagination).toStrictEqual({
      count: 5,
      limit: 10,
      offset: 0,
      total: 42,
    });
  });

  it('returns all marketplace purchase fields from the API', async () => {
    mocks.addMock(
      marketplacePurchasesUrl,
      {
        body: [
          {
            offeringName:
              'Red Hat OpenShift Streams for Apache Kafka - Testing Purposes Only',
            marketplaceAccount: '665427542893',
            marketplace: 'aws_marketplace',
            startDate: '2025-05-22T18:39:23.826220243Z',
            skus: ['MW01882'],
          },
        ],
        pagination: {
          count: 1,
          limit: 10,
          offset: 0,
          total: 1,
        },
      },
      true,
    );

    const { result } = renderHook(() => useMarketplacePurchases(), {
      wrapper: mocks.wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.body[0]).toStrictEqual({
      offeringName:
        'Red Hat OpenShift Streams for Apache Kafka - Testing Purposes Only',
      marketplaceAccount: '665427542893',
      marketplace: 'aws_marketplace',
      startDate: '2025-05-22T18:39:23.826220243Z',
      skus: ['MW01882'],
    });
  });

  it('enters error state on a non-200 response', async () => {
    mocks.addMock(marketplacePurchasesUrl, {}, false);

    const { result } = renderHook(() => useMarketplacePurchases(), {
      wrapper: mocks.wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('enters error state on network failure', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useMarketplacePurchases(), {
      wrapper: mocks.wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('starts in loading state', () => {
    mocks.addMock(marketplacePurchasesUrl, {}, true);

    const { result } = renderHook(() => useMarketplacePurchases(), {
      wrapper: mocks.wrapper,
    });

    expect(result.current.isLoading).toBe(true);
  });
});
