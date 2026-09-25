import React, { useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { formatDate } from '../../hooks/util/dates';
import {
  MarketplacePurchase,
  MarketplacePurchaseSortField
} from '../../hooks/api/useMarketplacePurchases';
import { marketplaceToFriendly } from '../../hooks/util/cloudProviderMaps';
import {
  generateQueryParamsForData,
  useQueryParamInformedAtom
} from '../../hooks/util/useQueryParam';
import {
  MarketplacePurchasesPaginationData,
  MarketplacePurchasesSortByData,
  MarketplacePurchasesSortDirData
} from '../../state/marketplacePurchases';
import { hasPaginationError } from '../../utils/errors';
import { PaginationError } from '../shared/PaginationError';
import { Link } from 'react-router-dom';
import { Paths } from '../../utils/routing';
import { useApiBasedTableSort } from '../../hooks/util/tables/useTableSort';
import { MarketplacePurchasesSubscriptions } from './MarketplacePurchasesSubscriptions';

type MarketplacePurchasesTableProps = {
  marketplacePurchases: MarketplacePurchase[];
};

export const MarketplacePurchasesTable = ({
  marketplacePurchases
}: MarketplacePurchasesTableProps) => {
  const [pagination, setPagination] = useQueryParamInformedAtom(
    MarketplacePurchasesPaginationData,
    'pagination'
  );

  const [sortBy, setSortBy] = useQueryParamInformedAtom(
    MarketplacePurchasesSortByData,
    'marketplacePurchasesActiveSortBy'
  );

  const [sortDir, setSortDir] = useQueryParamInformedAtom(
    MarketplacePurchasesSortDirData,
    'marketplacePurchasesActiveSortDir'
  );
  const sortFieldLookup: Record<number, MarketplacePurchaseSortField> = {
    0: 'offeringName',
    1: 'marketplaceAccount',
    2: 'marketplace',
    3: 'startDate'
  };

  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const setRowExpanded = (purchaseId: string, isExpanded: boolean) => {
    setExpandedRows((prevExpanded) => {
      const otherExpandedRows = prevExpanded.filter((id) => id !== purchaseId);

      return isExpanded ? [...otherExpandedRows, purchaseId] : otherExpandedRows;
    });
  };

  const { getSortParams } = useApiBasedTableSort('marketplacePurchasesSort', {
    sortBy,
    setSortBy: (by: string) => setSortBy(by as MarketplacePurchaseSortField),
    sortDir,
    setSortDir,
    lookup: sortFieldLookup
  });

  const onInvalidPage = hasPaginationError(pagination);

  const getPurchaseId = (purchase: MarketplacePurchase) =>
    `${purchase.marketplace}-${purchase.marketplaceAccount}-${purchase.offeringName}-${purchase.startDate}`;

  if (onInvalidPage) {
    return <PaginationError pagination={pagination} setPagination={setPagination} />;
  }

  return (
    <Table aria-label="Marketplace purchases table" variant="compact" isExpandable>
      <Thead>
        <Tr>
          <Th />
          <Th sort={getSortParams(0)}>Offering name</Th>
          <Th
            sort={getSortParams(1)}
            info={{
              tooltip:
                'Some providers allow purchases to be shared across multiple provider accounts. The account shown here is the one that paid for the purchase.',
              className: 'repositories-info-tip',
              popoverProps: {
                headerContent: 'Provider account'
              },
              tooltipProps: {
                isContentLeftAligned: true
              }
            }}
          >
            Marketplace account
          </Th>
          <Th sort={getSortParams(2)}>Marketplace</Th>
          <Th
            sort={getSortParams(3)}
            info={{
              tooltip:
                'The date shown here reflects the time that Red Hat was informed of the purchase. This date may differ from the date shown by the cloud provider.',
              className: 'date-added-tooltip',
              popoverProps: {
                headerContent: 'Date Added'
              },
              tooltipProps: {
                isContentLeftAligned: true
              }
            }}
          >
            Date added
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {marketplacePurchases.map((purchase, index) => {
          const purchaseId = getPurchaseId(purchase);
          const hasSubscriptions = purchase.skus.length > 0;
          const isExpanded = expandedRows.includes(purchaseId);
          return (
            <React.Fragment key={`${pagination.page}-${index}`}>
              <Tr isContentExpanded={isExpanded}>
                <Td
                  expand={
                    hasSubscriptions
                      ? {
                          rowIndex: index,
                          isExpanded,
                          onToggle: () => setRowExpanded(purchaseId, !isExpanded)
                        }
                      : undefined
                  }
                />
                <Td dataLabel="Offering name">{purchase.offeringName}</Td>
                <Td dataLabel="Marketplace account">
                  <Link
                    to={`../${Paths.CloudAccounts}?${generateQueryParamsForData(
                      [purchase.marketplaceAccount],
                      'providerAccountID'
                    )}`}
                  >
                    {purchase.marketplaceAccount}
                  </Link>
                </Td>
                <Td dataLabel="Marketplace">
                  {marketplaceToFriendly[purchase.marketplace] ?? purchase.marketplace}
                </Td>
                <Td dataLabel="Date added">{formatDate(purchase.startDate)}</Td>
              </Tr>
              {isExpanded && hasSubscriptions && (
                <MarketplacePurchasesSubscriptions skus={purchase.skus} isExpanded={isExpanded} />
              )}
            </React.Fragment>
          );
        })}
      </Tbody>
    </Table>
  );
};
