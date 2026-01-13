import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useQuery } from '@tanstack/react-query';

export const useRbacPermission = () => {
  const chrome = useChrome();

  return useQuery({
    queryKey: ['rbacPermissions'],
    queryFn: async () => {
      const permissions = (
        await chrome.getUserPermissions('subscriptions')
      ).map((access) => access.permission);

      return {
        canReadCloudAccess: permissions.includes(
          'subscriptions:cloud_access:read',
        ),
      };
    },
  });
};
