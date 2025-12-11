export const Cloud_Providers = ['AWS', 'Azure', 'Google Cloud'] as const;

export type CloudProvider = (typeof Cloud_Providers)[number];

export const Cloud_Providers_Short_Names = ['AWS', 'GCE', 'MSAZ'] as const;

export type CloudProviderShortName =
  (typeof Cloud_Providers_Short_Names)[number];

export const Cloud_Provider_Api_Params = ['aws', 'azure', 'gcp'] as const;

export type CloudProviderId = (typeof Cloud_Provider_Api_Params)[number];
