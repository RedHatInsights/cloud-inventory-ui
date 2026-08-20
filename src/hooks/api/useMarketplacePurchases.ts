import { useQuery } from '@tanstack/react-query';
import { HttpError } from '../../utils/errors';

const QUERY_STALE_TIME = 5 * 60 * 1000;

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
  sortField?: MarketplacePurchaseSortField;
  sortDirection?: SortDirection;
  offeringName?: string;
  marketplaceAccount?: string;
  marketplace?: string[];
};

export type MarketplacePurchaseSortField =
  | 'offeringName'
  | 'marketplaceAccount'
  | 'marketplace'
  | 'startDate';

export type SortDirection = 'asc' | 'desc';

const fetchMarketplacePurchases = async ({
  limit,
  offset,
  sortField,
  sortDirection,
  offeringName,
  marketplaceAccount,
  marketplace
}: FetchMarketplacePurchasesArgs): Promise<MarketplacePurchasesResponse> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset)
  });

  if (sortField && sortDirection) {
    params.set('sort_by', sortField);
    params.set('sort_direction', sortDirection);
  }

  if (offeringName) {
    params.set('offeringName', offeringName);
  }

  if (marketplaceAccount) {
    params.set('marketplaceAccount', marketplaceAccount);
  }

  if (marketplace?.length) {
    params.set('marketplace', marketplace.join(','));
  }

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
    enabled,
    staleTime: QUERY_STALE_TIME
  });
};
