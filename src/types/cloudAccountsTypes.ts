import { SortByDirection } from '@patternfly/react-table';

export enum CloudProviderShortname {
  AWS = 'AWS',
  GCP = 'GCE',
  AZURE = 'MSAZ',
}

export enum CloudProviderDisplayNames {
  AWS = 'AWS',
  GCP = 'Google Compute Engine',
  AZURE = 'Microsoft Azure',
}

export const ProviderLabelMap: Record<string, string> = {
  [CloudProviderShortname.AWS]: CloudProviderDisplayNames.AWS,
  [CloudProviderShortname.GCP]: CloudProviderDisplayNames.GCP,
  [CloudProviderShortname.AZURE]: CloudProviderDisplayNames.AZURE,
};

export type CloudAccount = {
  providerAccountID: string;
  goldImageAccess: 'Granted' | 'Requested' | 'Failed';
  dateAdded: string;
  providerLabel: string;
  sourceID?: string;
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

export type FetchCloudAccountsArgs = {
  limit: number;
  offset: number;
  sortField?: string;
  sortDirection?: SortByDirection;
  providerAccountID?: string;
  shortName?: string[];
  goldImageAccess?: string[];
};
