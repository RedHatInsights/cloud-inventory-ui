import { CloudProviderName } from '../../hooks/api/useGoldImages';
import { CloudAccountStatus } from './GetStatusIcon';

export interface CloudAccountRow {
  id: string;
  provider: CloudProviderName;
  goldImage: CloudAccountStatus;
  date: string;
  [key: string]: string;
}
