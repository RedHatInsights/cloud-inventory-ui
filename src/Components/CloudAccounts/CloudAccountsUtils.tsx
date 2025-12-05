import { Provider } from './types';
export const providerIdToProvider: Record<string, Provider> = {
  aws: 'AWS',
  azure: 'Azure',
  gcp: 'Google Cloud',
};

export const providerToParam: Record<Provider, string> = {
  AWS: 'aws',
  Azure: 'azure',
  'Google Cloud': 'google',
} as const;

export const PROVIDER_MAP = {
  AWS: 'AWS',
  GCE: 'Google Cloud',
  MSAZ: 'Azure',
} as const;

export type ProviderKey = keyof typeof PROVIDER_MAP;
