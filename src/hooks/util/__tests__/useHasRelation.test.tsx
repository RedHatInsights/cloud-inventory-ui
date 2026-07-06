import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { fetchDefaultWorkspace } from '@project-kessel/react-kessel-access-check';
import { ManipulatableQueryWrapper } from '../../../Components/util/testing/ManipulatableQueryWrapper';
import { Relation, useHasRelation } from '../useHasRelation';
const mockCheck = jest.fn();
jest.mock('@project-kessel/react-kessel-access-check', () => ({
  fetchDefaultWorkspace: jest.fn(() => Promise.resolve({ id: 'org-id' })),
  useAccessCheckContext: jest.fn(() => ({})),
}));
jest.mock('@project-kessel/react-kessel-access-check/core/api-client', () => ({
  checkSelf: (...args: unknown[]) => mockCheck(...args),
}));
describe('useHasRelation', () => {
  let hookResult: ReturnType<typeof useHasRelation>;
  const HookConsumer = ({ relation }: { relation: Relation }) => {
    hookResult = useHasRelation(relation);
    return null;
  };
  const { ComponentWithQueryClient, queryClient } = ManipulatableQueryWrapper(
    <HookConsumer relation={Relation.CLOUD_ACCESS_VIEW} />,
  );
  beforeEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
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
  it('calls fetchDefaultWorkspace with window origin', async () => {
    render(<ComponentWithQueryClient />);
    await waitFor(() => {
      expect(fetchDefaultWorkspace).toHaveBeenCalledWith(
        window.location.origin,
      );
    });
  });
  it('calls checkSelf with organization resource', async () => {
    render(<ComponentWithQueryClient />);
    await waitFor(() => {
      expect(mockCheck).toHaveBeenCalledWith(
        {},
        {
          relation: Relation.CLOUD_ACCESS_VIEW,
          resource: {
            id: 'org-id',
            type: 'organization',
            reporter: { type: 'rbac' },
          },
        },
      );
    });
  });
  it('returns false when default workspace fails', async () => {
    (fetchDefaultWorkspace as jest.Mock).mockRejectedValue(
      new Error('workspace error'),
    );
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
