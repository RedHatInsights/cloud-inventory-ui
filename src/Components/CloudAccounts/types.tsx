export type Provider = 'AWS' | 'Azure' | 'Google Cloud';

export interface CloudAccountRow {
  id: string;
  provider: Provider;
  goldImage: string;
  date: string;
  [key: string]: string;
}
