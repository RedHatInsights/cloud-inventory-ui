import React from 'react';
import { Link } from 'react-router-dom';
import { SearchInput } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useTableSort } from '../../hooks/util/tables/useTableSort';
import { MarketplacePurchasesSkuDetail } from '../../hooks/api/useMarketplacePurchasesSkuDetails';

type MarketplacePurchasesSubscriptionsOverflowTableProps = {
  subscriptions: MarketplacePurchasesSkuDetail[];
};

export const MarketplacePurchasesSubscriptionsOverflowTable = ({
  subscriptions
}: MarketplacePurchasesSubscriptionsOverflowTableProps) => {
  const [filterValue, setFilterValue] = React.useState('');

  const filteredSubscriptions = subscriptions.filter(({ sku, description }) => {
    const filter = filterValue.toLowerCase();

    return description.toLowerCase().includes(filter) || sku.toLowerCase().includes(filter);
  });

  const { sorted: sortedSubscriptions, getSortParams } = useTableSort(
    filteredSubscriptions,
    'marketplacePurchasesSubscriptionsSort',
    {
      rowTranslator: ({ description, sku }) => [description, sku]
    }
  );

  return (
    <>
            
      <SearchInput
        aria-label="Filter by name or SKU"
        placeholder="Filter by name or SKU"
        value={filterValue}
        onChange={(_event, value) => setFilterValue(value)}
        onClear={() => setFilterValue('')}
      />
      <Table aria-label="Subscriptions table" variant="compact">
        <Thead>
          <Tr>
            <Th sort={getSortParams(0)}>Subscription name</Th>
            <Th sort={getSortParams(1)}>SKU</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedSubscriptions.map(({ sku, description }) => (
            <Tr key={sku}>
              <Td dataLabel="Subscription name">
                <Link to={`/subscriptions/inventory/${sku}`}> {description}</Link>
              </Td>
              <Td dataLabel="SKU">{sku}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
          
    </>
  );
};
