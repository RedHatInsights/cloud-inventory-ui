import { Provider } from './types';

export const providerToParam: Record<Provider, string> = {
  AWS: 'aws',
  Azure: 'azure',
  'Google Cloud': 'google',
} as const;
