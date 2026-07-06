import {
  fetchDefaultWorkspace,
  useAccessCheckContext,
} from '@project-kessel/react-kessel-access-check';
import { checkSelf } from '@project-kessel/react-kessel-access-check/core/api-client';
import { useQuery } from '@tanstack/react-query';

const QUERY_STALE_TIME = 5 * 60 * 1000;

export enum Relation {
  CLOUD_ACCESS_VIEW = 'subscriptions_cloud_access_view',
  CLOUD_ACCESS_EDIT = 'subscriptions_cloud_access_edit',
}

interface HasRelationResult {
  has: boolean;
  isLoading: boolean;
}

const useDefaultWorkspace = () =>
  useQuery({
    queryKey: ['rbac', 'default-workspace'],
    queryFn: async () => await fetchDefaultWorkspace(window.location.origin),
    staleTime: QUERY_STALE_TIME,
  });

export const useHasRelation = (relation: Relation): HasRelationResult => {
  const accessCheckContext = useAccessCheckContext();

  const {
    data: defaultWorkspace,
    isLoading: defaultWorkspaceIsLoading,
    isError: defaultWorkspaceIsError,
  } = useDefaultWorkspace();

  const { data: has, isLoading: accessCheckIsLoading } = useQuery({
    queryKey: ['kessel', relation, defaultWorkspace?.id],
    queryFn: async () => {
      if (!defaultWorkspace) {
        throw new Error('default workspace does not exist');
      }

      return (
        (
          await checkSelf(accessCheckContext, {
            relation,
            resource: {
              id: defaultWorkspace.id,
              type: 'organization',
              reporter: { type: 'rbac' },
            },
          })
        ).allowed === 'ALLOWED_TRUE'
      );
    },
    enabled: !defaultWorkspaceIsLoading && !defaultWorkspaceIsError,
    staleTime: QUERY_STALE_TIME,
  });

  return {
    has: !!has,
    isLoading: accessCheckIsLoading || defaultWorkspaceIsLoading,
  };
};
