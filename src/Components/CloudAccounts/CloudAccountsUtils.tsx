import {
  CloudProvider,
  CloudProviderId,
  CloudProviderShortName,
} from './CloudAccountProviders';

export const CloudProviderLabelMap: Record<
  CloudProviderShortName,
  CloudProvider
> = {
  AWS: 'AWS',
  GCE: 'Google Cloud',
  MSAZ: 'Azure',
};

export const providerToApiParam: Record<CloudProvider, CloudProviderId> = {
  AWS: 'aws',
  Azure: 'azure',
  'Google Cloud': 'gcp',
} as const;

export type ProviderKey = keyof typeof CloudProviderLabelMap;
