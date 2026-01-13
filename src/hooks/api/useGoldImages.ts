import { useQuery } from '@tanstack/react-query';
import { HttpError } from '../../utils/errors';

type GoldImage = {
  name: string;
  description: string;
};

export enum CloudProviderName {
  AWS = 'AWS',
  GCP = 'Google Compute Engine',
  AZURE = 'Microsoft Azure',
}

type CloudProviderDetail = {
  provider: CloudProviderName;
  goldImages: GoldImage[];
};

export type GoldImagesResponse = Record<string, CloudProviderDetail>;

const fetchGoldImages: () => Promise<GoldImagesResponse> = async () => {
  const response = await fetch(
    '/api/rhsm/v2/cloud_access_providers/gold_images',
  );

  if (!response.ok) {
    throw new HttpError(
      `Something went wrong`,
      response.status,
      response.statusText,
    );
  }

  return (await response.json()).body as GoldImagesResponse;
};

export const useGoldImages = () => {
  return useQuery({ queryKey: ['goldImages'], queryFn: fetchGoldImages });
};
