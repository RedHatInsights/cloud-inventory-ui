import { useAccessCheckContext } from '@project-kessel/react-kessel-access-check';
import { checkSelf } from '@project-kessel/react-kessel-access-check/core/api-client';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useQuery } from '@tanstack/react-query';

const QUERY_STALE_TIME = 5 * 60 * 1000;

export enum Relation {
  CLOUD_ACCESS_VIEW = 'subscriptions_cloud_access_view',
  CLOUD_ACCESS_EDIT = 'subscriptions_cloud_access_edit'
}

interface HasRelationResult {
  has: boolean;
  isLoading: boolean;
}

export const useHasRelation = (relation: Relation): HasRelationResult => {
  const accessCheckContext = useAccessCheckContext();
  const chrome = useChrome();

  const { data: has, isLoading: accessCheckIsLoading } = useQuery({
    queryKey: ['kessel', relation],
    queryFn: async () => {
      const user = await chrome.auth.getUser();

      if (!user) {
        throw new Error('user does not exist');
      }

      return (
        (
          await checkSelf(accessCheckContext, {
            relation,
            resource: {
              id: `redhat/${user.identity.org_id}`,
              type: 'tenant',
              reporter: { type: 'rbac' }
            }
          })
        ).allowed === 'ALLOWED_TRUE'
      );
    },
    staleTime: QUERY_STALE_TIME
  });

  return {
    has: !!has,
    isLoading: accessCheckIsLoading
  };
};
