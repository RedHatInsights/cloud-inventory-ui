import { CloudProvider } from './CloudAccountProviders';

export interface CloudAccountRow {
  id: string;
  provider: CloudProvider;
  goldImage: string;
  date: string;
  [key: string]: string;
}
