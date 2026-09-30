import { renderHook, waitFor } from '@testing-library/react';
import { RequestMocks } from '../../../Components/util/testing/mockApiResponse';
import { useMarketplacePurchasesSkuDetails } from '../useMarketplacePurchasesSkuDetails';
const mocks = new RequestMocks();
const skuDetailsUrl = '/api/rhsm/v2/cloud_access_providers/marketplace_purchases/sku_details';
describe('useMarketplacePurchasesSkuDetails', () => {
  beforeEach(() => {
    mocks.reset();
  });

  const skus = ['123456', '789012'];

  const params = new URLSearchParams({ skus: skus.join(',') });
  it('fetches SKU details for provided SKUs', async () => {
    mocks.addMock(
      `${skuDetailsUrl}?${params.toString()}`,
      {
        body: [
          {
            sku: '123456',
            description: 'Test subscription one'
          },
          {
            sku: '789012',
            description: 'Test subscription twp'
          }
        ]
      },
      true
    );
    const { result } = renderHook(() => useMarketplacePurchasesSkuDetails(['123456', '789012']), {
      wrapper: mocks.wrapper
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.body).toHaveLength(2);
    expect(result.current.data?.body[0]).toStrictEqual({
      sku: '123456',
      description: 'Test subscription one'
    });
  });
  it('returns empty list when no SKU details exist', async () => {
    mocks.addMock(
      `${skuDetailsUrl}?skus=123456`,
      {
        body: []
      },
      true
    );
    const { result } = renderHook(() => useMarketplacePurchasesSkuDetails(['123456']), {
      wrapper: mocks.wrapper
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.body).toEqual([]);
  });

  it('enters error state on network failure', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
    try {
      const { result } = renderHook(() => useMarketplacePurchasesSkuDetails(['123456']), {
        wrapper: mocks.wrapper
      });
      await waitFor(() => expect(result.current.isError).toBe(true));
    } finally {
      fetchSpy.mockRestore();
    }
  });
  it('starts in loading state', () => {
    mocks.addMock(`${skuDetailsUrl}?skus=123456`, {}, true);
    const { result } = renderHook(() => useMarketplacePurchasesSkuDetails(['123456']), {
      wrapper: mocks.wrapper
    });
    expect(result.current.isLoading).toBe(true);
  });
});
