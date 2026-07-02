import { renderHook, waitFor } from '@testing-library/react';
import {
  fetchDefaultWorkspace,
  useAccessCheckContext,
} from '@project-kessel/react-kessel-access-check';
import { checkSelf } from '@project-kessel/react-kessel-access-check/core/api-client';

import { Relation, useHasRelation } from '../useHasRelation';
import { createQueryWrapper } from '../../../utils/testing/testHelpers';

jest.mock('@project-kessel/react-kessel-access-check');
jest.mock('@project-kessel/react-kessel-access-check/core/api-client');

describe('useHasRelation', () => {
  const mockCheckSelf = checkSelf as jest.Mock;
  const mockFetchDefaultWorkspace = fetchDefaultWorkspace as jest.Mock;

  const renderUseHasRelation = (relation = Relation.CLOUD_ACCESS_VIEW) =>
    renderHook(() => useHasRelation(relation), {
      wrapper: createQueryWrapper(),
    });

  beforeEach(() => {
    jest.clearAllMocks();

    (useAccessCheckContext as jest.Mock).mockReturnValue({});
    mockFetchDefaultWorkspace.mockResolvedValue({ id: 'org-123' });
  });

  it('returns true when access check passes', async () => {
    mockCheckSelf.mockResolvedValue({ allowed: 'ALLOWED_TRUE' });

    const { result } = renderUseHasRelation();

    await waitFor(() => {
      expect(result.current.has).toBe(true);
    });
  });

  it('returns false while loading', () => {
    mockCheckSelf.mockResolvedValue({ allowed: 'ALLOWED_TRUE' });

    const { result } = renderUseHasRelation();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.has).toBe(false);
  });

  it('returns false when access check fails', async () => {
    mockCheckSelf.mockResolvedValue({ allowed: 'ALLOWED_FALSE' });

    const { result } = renderUseHasRelation();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.has).toBe(false);
  });

  it('calls fetchDefaultWorkspace with window origin', async () => {
    mockCheckSelf.mockResolvedValue({ allowed: 'ALLOWED_TRUE' });

    renderUseHasRelation();

    await waitFor(() => {
      expect(mockFetchDefaultWorkspace).toHaveBeenCalledWith(
        window.location.origin,
      );
    });
  });

  it('calls checkSelf with organization resource', async () => {
    mockCheckSelf.mockResolvedValue({ allowed: 'ALLOWED_TRUE' });

    renderUseHasRelation(Relation.CLOUD_ACCESS_VIEW);

    await waitFor(() => {
      expect(mockCheckSelf).toHaveBeenCalledWith(
        {},
        {
          relation: Relation.CLOUD_ACCESS_VIEW,
          resource: {
            id: 'org-123',
            type: 'organization',
            reporter: { type: 'rbac' },
          },
        },
      );
    });
  });

  it('returns false when default workspace fails', async () => {
    mockFetchDefaultWorkspace.mockRejectedValue(new Error('workspace error'));

    const { result } = renderUseHasRelation();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.has).toBe(false);
    expect(mockCheckSelf).not.toHaveBeenCalled();
  });

  it('returns false on query error', async () => {
    mockCheckSelf.mockRejectedValue(new Error('whoops'));

    const { result } = renderUseHasRelation();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.has).toBe(false);
  });

  it('returns false on unexpected Kessel response', async () => {
    mockCheckSelf.mockResolvedValue({ allowed: 'A_WEIRD_VALUE' });

    const { result } = renderUseHasRelation();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.has).toBe(false);
  });
});
