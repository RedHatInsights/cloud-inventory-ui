import { useQuery } from '@tanstack/react-query';
import { HttpError } from '../../utils/errors';

const QUERY_STALE_TIME = 5 * 60 * 1000;

export type MarketplacePurchasesSkuDetail = {
  sku: string;
  description: string;
};

export type MarketplacePurchasesSkuDetailsResponse = {
  body: MarketplacePurchasesSkuDetail[];
};

const fetchMarketplacePurchasesSkuDetails = async (
  skus: string[]
): Promise<MarketplacePurchasesSkuDetailsResponse> => {
  const params = new URLSearchParams({
    skus: skus.join(',')
  });

  const response = await fetch(
    `/api/rhsm/v2/cloud_access_providers/marketplace_purchases/sku_details?${params.toString()}`
  );

  if (!response.ok) {
    throw new HttpError('Something went wrong', response.status, response.statusText);
  }

  return response.json();
};

export const useMarketplacePurchasesSkuDetails = (skus: string[], enabled = true) => {
  return useQuery({
    queryKey: ['marketplacePurchaseSkuDetails', skus],
    queryFn: () => fetchMarketplacePurchasesSkuDetails(skus),
    enabled: enabled && skus.length > 0,
    staleTime: QUERY_STALE_TIME
  });
};
