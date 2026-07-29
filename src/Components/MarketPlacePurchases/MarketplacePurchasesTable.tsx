import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { formatDate } from '../../hooks/util/dates';
import { MarketplacePurchase } from '../../hooks/api/useMarketplacePurchases';
import { marketplaceToFriendly } from '../../hooks/util/cloudProviderMaps';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { MarketplacePurchasesPaginationData } from '../../state/marketplacePurchases';
import { hasPaginationError } from '../../utils/errors';
import { PaginationError } from '../shared/PaginationError';

type MarketplacePurchasesTableProps = {
  marketplacePurchases: MarketplacePurchase[];
};

export const MarketplacePurchasesTable = ({
  marketplacePurchases,
}: MarketplacePurchasesTableProps) => {
  const [pagination, setPagination] = useQueryParamInformedAtom(
    MarketplacePurchasesPaginationData,
    'pagination',
  );

  const onInvalidPage = hasPaginationError(pagination);

  if (onInvalidPage) {
    return (
      <PaginationError pagination={pagination} setPagination={setPagination} />
    );
  }

  return (
    <Table aria-label="Marketplace purchases table" variant="compact">
      <Thead>
        <Tr>
          <Th>Offering name</Th>
          <Th
            info={{
              tooltip:
                'Some providers allow purchases to be shared across multiple provider accounts. The account shown here is the one that paid for the purchase.',
              className: 'repositories-info-tip',
              popoverProps: {
                headerContent: 'Provider account',
              },
              tooltipProps: {
                isContentLeftAligned: true,
              },
            }}
          >
            Marketplace account           
          </Th>
          <Th>Marketplace</Th>
          <Th
            info={{
              tooltip:
                'The date shown here reflects the time that Red Hat was informed of the purchase. This date may differ from the date shown by the cloud provider.',
              className: 'date-added-tooltip',
              popoverProps: {
                headerContent: 'Date Added',
              },
              tooltipProps: {
                isContentLeftAligned: true,
              },
            }}
          >
            Date added           
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {marketplacePurchases.map((purchase) => (
          <Tr
            key={`${purchase.marketplace}-${purchase.marketplaceAccount}-${purchase.offeringName}`}
          >
            <Td dataLabel="Offering name">{purchase.offeringName}</Td>
            <Td dataLabel="Marketplace account">
              {purchase.marketplaceAccount}
            </Td>
            <Td dataLabel="Marketplace">
              {marketplaceToFriendly[purchase.marketplace] ??
                purchase.marketplace}
            </Td>
            <Td dataLabel="Date added">{formatDate(purchase.startDate)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
