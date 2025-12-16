import { useQuery } from '@tanstack/react-query';
import { HttpError } from '../../utils/errors';

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
};

const fetchCloudAccounts = async ({
  limit,
  offset,
}: fetchCloudAccountsArgs): Promise<CloudAccountsResponse> => {
  const response = await fetch(
    `/api/rhsm/v2/cloud_access_providers/accounts?limit=${limit}&offset=${offset}`
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
