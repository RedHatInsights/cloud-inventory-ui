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
