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

export type FetchMarketplacePurchasesArgs = {
  limit: number;
  offset: number;
};

const fetchMarketplacePurchases = async ({
  limit,
  offset
}: FetchMarketplacePurchasesArgs): Promise<MarketplacePurchasesResponse> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset)
  });

  params.set('sort_by', 'startDate');
  params.set('sort_direction', 'desc');

  const response = await fetch(
    `/api/rhsm/v2/cloud_access_providers/marketplace_purchases?${params.toString()}`
  );

  if (!response.ok) {
    throw new HttpError('Something went wrong', response.status, response.statusText);
  }
  const json = await response.json();
  return json as MarketplacePurchasesResponse;
};

export const useMarketplacePurchases = (args: FetchMarketplacePurchasesArgs, enabled = true) => {
  return useQuery({
    queryKey: ['marketplacePurchases', args],
    queryFn: () => fetchMarketplacePurchases(args),
    enabled
  });
};
