import { useQuery } from '@tanstack/react-query';
import { HttpError } from '../../utils/errors';

export type MarketplacePurchase = {
  offeringName: string;
  marketplaceAccount: string;
  marketplace: string;
  startDate: string;
  skus: string[];
};

export type MarketplacePurchasesResponse = {
  pagination: {
    offset: number;
    limit: number;
    count: number;
    total: number;
  };
  body: MarketplacePurchase[];
};

const fetchMarketplacePurchases =
  async (): Promise<MarketplacePurchasesResponse> => {
    const response = await fetch(
      '/api/rhsm/v2/cloud_access_providers/marketplace_purchases',
    );

    if (!response.ok) {
      throw new HttpError(
        'Something went wrong',
        response.status,
        response.statusText,
      );
    }

    return (await response.json()) as MarketplacePurchasesResponse;
  };

export const useMarketplacePurchases = () => {
  return useQuery({
    queryKey: ['marketplacePurchases'],
    queryFn: fetchMarketplacePurchases,
  });
};
