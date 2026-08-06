import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ManipulatableQueryWrapper } from '../../../Components/util/testing/ManipulatableQueryWrapper';
import { Relation, useHasRelation } from '../useHasRelation';

const mockCheck = jest.fn();
const mockGetUser = jest.fn();
jest.mock('@project-kessel/react-kessel-access-check', () => ({
  useAccessCheckContext: jest.fn(() => ({}))
}));
jest.mock('@project-kessel/react-kessel-access-check/core/api-client', () => ({
  checkSelf: (...args: unknown[]) => mockCheck(...args)
}));
jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({
    auth: {
      getUser: mockGetUser
    }
  })
}));

describe('useHasRelation', () => {
  let hookResult: ReturnType<typeof useHasRelation>;
  const HookConsumer = ({ relation }: { relation: Relation }) => {
    hookResult = useHasRelation(relation);
    return null;
  };
  const { ComponentWithQueryClient, queryClient } = ManipulatableQueryWrapper(
    <HookConsumer relation={Relation.CLOUD_ACCESS_VIEW} />
  );
  beforeEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({
      identity: {
        org_id: 'org-id'
      }
    });
    mockCheck.mockResolvedValue({ allowed: 'ALLOWED_TRUE' });
  });
  afterEach(() => {
    queryClient.clear();
  });

  it('returns true when access check passes', async () => {
    render(<ComponentWithQueryClient />);
    await waitFor(() => {
      expect(hookResult.has).toBe(true);
    });
  });

  it('returns false while loading', () => {
    render(<ComponentWithQueryClient />);
    expect(hookResult.isLoading).toBe(true);
    expect(hookResult.has).toBe(false);
  });

  it('returns false when access check fails', async () => {
    mockCheck.mockResolvedValue({ allowed: 'ALLOWED_FALSE' });
    render(<ComponentWithQueryClient />);
    await waitFor(() => {
      expect(hookResult.isLoading).toBe(false);
    });
    expect(hookResult.has).toBe(false);
  });

  it('calls checkSelf with tenant resource', async () => {
    render(<ComponentWithQueryClient />);
    await waitFor(() => {
      expect(mockCheck).toHaveBeenCalledWith(
        {},
        {
          relation: Relation.CLOUD_ACCESS_VIEW,
          resource: {
            id: 'redhat/org-id',
            type: 'tenant',
            reporter: { type: 'rbac' }
          }
        }
      );
    });
  });

  it('returns false when user fails', async () => {
    mockGetUser.mockRejectedValue(new Error('user error'));
    render(<ComponentWithQueryClient />);
    await waitFor(() => {
      expect(hookResult.isLoading).toBe(false);
    });
    expect(hookResult.has).toBe(false);
    expect(mockCheck).not.toHaveBeenCalled();
  });

  it('returns false on query error', async () => {
    mockCheck.mockRejectedValue(new Error('whoops'));
    render(<ComponentWithQueryClient />);
    await waitFor(() => {
      expect(hookResult.isLoading).toBe(false);
    });
    expect(hookResult.has).toBe(false);
  });

  it('returns false on unexpected Kessel response', async () => {
    mockCheck.mockResolvedValue({ allowed: 'A_WEIRD_VALUE' });
    render(<ComponentWithQueryClient />);
    await waitFor(() => {
      expect(hookResult.isLoading).toBe(false);
    });
    expect(hookResult.has).toBe(false);
  });
});
