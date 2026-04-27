import { useQuery } from '@tanstack/react-query';
import { HttpError } from '../../utils/errors';
import {
  CloudAccountsResponse,
  FetchCloudAccountsArgs,
} from '../../types/cloudAccountsTypes';

const fetchCloudAccounts = async ({
  limit,
  offset,
  sortField,
  sortDirection,
  providerAccountID,
  shortName,
  goldImageAccess,
}: FetchCloudAccountsArgs): Promise<CloudAccountsResponse> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (sortField && sortDirection) {
    params.set('sort_by', sortField);
    params.set('sort_direction', sortDirection);
  }

  if (providerAccountID) {
    params.set('providerAccountID', providerAccountID);
  }

  if (shortName?.length) {
    params.set('shortName', shortName.join(','));
  }

  if (goldImageAccess?.length) {
    params.set('goldImageAccess', goldImageAccess.join(','));
  }

  const response = await fetch(
    `/api/rhsm/v2/cloud_access_providers/accounts?${params.toString()}`,
  );

  if (!response.ok) {
    throw new HttpError(
      'Something went wrong',
      response.status,
      response.statusText,
    );
  }

  const json = await response.json();
  return json as CloudAccountsResponse;
};

export const useCloudAccounts = (args: FetchCloudAccountsArgs) => {
  return useQuery({
    queryKey: ['cloudAccounts', args],
    queryFn: () => fetchCloudAccounts(args),
  });
};
