import { CloudProviderShortname } from '../api/useCloudAccounts';
import { CloudProviderName } from '../api/useGoldImages';

export const shortToFriendly: Record<
  CloudProviderShortname,
  CloudProviderName
> = {
  [CloudProviderShortname.AWS]: CloudProviderName.AWS,
  [CloudProviderShortname.GCP]: CloudProviderName.GCP,
  [CloudProviderShortname.AZURE]: CloudProviderName.AZURE,
};

export const friendlyToApiParam: Record<CloudProviderName, string> = {
  [CloudProviderName.AWS]: 'aws',
  [CloudProviderName.GCP]: 'gcp',
  [CloudProviderName.AZURE]: 'azure',
};
export const shortNameToDisplay: Record<CloudProviderShortname, string> = {
  [CloudProviderShortname.AWS]: 'AWS',
  [CloudProviderShortname.GCP]: 'GCP',
  [CloudProviderShortname.AZURE]: 'Azure',
};
