import { useQuery } from '@tanstack/react-query';
import { HttpError } from '../../utils/errors';
import { CloudProviderShortName } from '../../Components/CloudAccounts/CloudAccountProviders';

export type CloudAccount = {
  providerAccountID: string;
  goldImageAccess: 'Granted' | 'Requested' | 'Failed';
  dateAdded: string;
  shortName: CloudProviderShortName;
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

const fetchCloudAccounts = async (): Promise<CloudAccountsResponse> => {
  const response = await fetch('/api/rhsm/v2/cloud_access_providers/accounts');

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

export const useCloudAccounts = () => {
  return useQuery({ queryKey: ['cloudAccounts'], queryFn: fetchCloudAccounts });
};
