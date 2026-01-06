import { useQuery } from '@tanstack/react-query';
import { HttpError } from '../../utils/errors';
import { SortByDirection } from '@patternfly/react-table';

export enum CloudProviderShortname {
  AWS = 'AWS',
  GCP = 'GCE',
  AZURE = 'MSAZ',
}

export type CloudAccount = {
  providerAccountID: string;
  goldImageAccess: 'Granted' | 'Requested' | 'Failed';
  dateAdded: string;
  providerLabel: string;
  shortName: CloudProviderShortname;
};

export type CloudAccountsResponse = {
  body: CloudAccount[];
  pagination: {
    count: number;
    limit: number;
    offset: number;
    total: number;
  };
};

export type fetchCloudAccountsArgs = {
  limit: number;
  offset: number;
  sortField?: string;
  sortDirection?: SortByDirection;
};

const fetchCloudAccounts = async ({
  limit,
  offset,
  sortField,
  sortDirection,
}: fetchCloudAccountsArgs): Promise<CloudAccountsResponse> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (sortField && sortDirection) {
    params.set('sort_by', sortField);
    params.set('sort_direction', sortDirection);
  }
  const response = await fetch(
    `/api/rhsm/v2/cloud_access_providers/accounts?${params.toString()}`
  );

  if (!response.ok) {
    throw new HttpError(
      `Something went wrong`,
      response.status,
      response.statusText
    );
  }
  const json = await response.json();

  return json as CloudAccountsResponse;
};

export const useCloudAccounts = (args: fetchCloudAccountsArgs) => {
  return useQuery({
    queryKey: ['cloudAccounts', args],
    queryFn: () => fetchCloudAccounts(args),
  });
};
