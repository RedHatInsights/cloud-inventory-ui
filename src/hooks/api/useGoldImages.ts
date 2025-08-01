import { useQuery } from '@tanstack/react-query';
import { HttpError } from '../../utils/errors';

type GoldImage = {
  name: string;
  description: string;
};

type CloudProviderDetail = {
  provider: string;
  goldImages: GoldImage[];
};

export type GoldImagesResponse = Record<string, CloudProviderDetail>;

const fetchGoldImages: () => Promise<GoldImagesResponse> = async () => {
  const response = await fetch(
    '/api/rhsm/v2/cloud_access_providers/gold_images'
  );

  if (!response.ok) {
    throw new HttpError(
      `Something went wrong`,
      response.status,
      response.statusText
    );
  }

  const goldImages = (await response.json()).body as GoldImagesResponse;

  return goldImages;
};

export const useGoldImages = () => {
  return useQuery({ queryKey: ['goldImages'], queryFn: fetchGoldImages });
};
