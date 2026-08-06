import { CloudProviderDisplayNames, CloudProviderShortname } from '../../types/cloudAccountsTypes';
import { CloudProviderName } from '../api/useGoldImages';

export const shortToFriendly: Record<CloudProviderShortname, CloudProviderName> = {
  [CloudProviderShortname.AWS]: CloudProviderName.AWS,
  [CloudProviderShortname.GCP]: CloudProviderName.GCP,
  [CloudProviderShortname.AZURE]: CloudProviderName.AZURE
};

export const marketplaceToFriendly: Record<string, string> = {
  aws_marketplace: CloudProviderDisplayNames.AWS,
  azure_marketplace: CloudProviderDisplayNames.AZURE,
  gcp_marketplace: CloudProviderDisplayNames.GCP
};
