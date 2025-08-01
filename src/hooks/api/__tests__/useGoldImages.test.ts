import { renderHook, waitFor } from '@testing-library/react';
import { RequestMocks } from '../../../Components/util/testing/mockApiResponse';
import { useGoldImages } from '../useGoldImages';

const mocks = new RequestMocks();

describe('Gold Images hook', () => {
  beforeEach(() => mocks.reset());

  it('fetches the data', async () => {
    mocks.addMock(
      '/api/rhsm/v2/cloud_access_providers/gold_images',
      {
        body: { AWS: { provider: 'AWS', goldImages: [] } },
      },
      true
    );

    const { result } = renderHook(() => useGoldImages(), {
      wrapper: mocks.wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toStrictEqual({
      AWS: { provider: 'AWS', goldImages: [] },
    });
  });

  it('handles an error when it throws one', async () => {
    mocks.addMock('/api/rhsm/v2/cloud_access_providers/gold_images', {}, false);

    const { result } = renderHook(() => useGoldImages(), {
      wrapper: mocks.wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBeTruthy();
  });
});
