import React from 'react';
import { Link } from 'react-router-dom';
import { SearchInput } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

type Subscription = {
  sku: string;
  description: string;
};

type MarketplacePurchasesSubscriptionsTableProps = {
  subscriptions: Subscription[];
};

type SortField = 'description' | 'sku';

export const MarketplacePurchasesSubscriptionsTable = ({
  subscriptions
}: MarketplacePurchasesSubscriptionsTableProps) => {
  const [filterValue, setFilterValue] = React.useState('');
  const [sortField, setSortField] = React.useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredSubscriptions = subscriptions.filter(({ sku, description }) => {
    const filter = filterValue.toLowerCase();

    return description.toLowerCase().includes(filter) || sku.toLowerCase().includes(filter);
  });

  const sortedSubscriptions = sortField
    ? [...filteredSubscriptions].sort((a, b) => {
        const aValue = a[sortField].toLowerCase();
        const bValue = b[sortField].toLowerCase();

        const comparison = aValue.localeCompare(bValue);

        return sortDirection === 'asc' ? comparison : -comparison;
      })
    : filteredSubscriptions;

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
            <Th
              sort={{
                sortBy: {
                  index: sortField === 'description' ? 0 : undefined,
                  direction: sortField === 'description' ? sortDirection : undefined
                },
                onSort: () => handleSort('description'),
                columnIndex: 0
              }}
            >
              Subscription name             
            </Th>
            <Th
              sort={{
                sortBy: {
                  index: sortField === 'sku' ? 1 : undefined,
                  direction: sortField === 'sku' ? sortDirection : undefined
                },
                onSort: () => handleSort('sku'),
                columnIndex: 1
              }}
            >
              SKU             
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedSubscriptions.map(({ sku, description }) => (
            <Tr key={sku}>
              <Td dataLabel="Subscription name">
                <Link to={`/subscriptions/inventory/${sku}`}>{description}</Link>
              </Td>
              <Td dataLabel="SKU">{sku}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};
