import { renderHook, waitFor } from '@testing-library/react';
import { RequestMocks } from '../../../Components/util/testing/mockApiResponse';
import { useRbacPermission } from '../useRbacPermissions';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({
    getUserPermissions: () =>
      Promise.resolve([{ permission: 'subscriptions:cloud_access:read' }]),
  }),
}));

const mocks = new RequestMocks();

describe('Rbac permissions hook', () => {
  it('returns the rbac permissions', async () => {
    const { result } = renderHook(useRbacPermission, {
      wrapper: mocks.wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.canReadCloudAccess).toBeTruthy();
  });
});
