export enum Paths {
  NoPermissions = 'no-permissions',
  Oops = 'oops',
  GoldImages = 'gold-images',
  CloudAccounts = 'cloud-accounts',
  MarketplacePurchases = 'marketplace-purchases',
  Catch = '*',
  Root = '/',
}

export const relativePath = (path: Paths) => `./${path}`;
