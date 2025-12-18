import React from 'react';
import {
  SortByDirection,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { Button, Content } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { CloudAccount } from '../../hooks/api/useCloudAccounts';
import { CloudAccountRow } from './types';
import { CloudAccountStatus, getStatusIcon } from './GetStatusIcon';
import { formatDate } from '../../hooks/util/dates';
import { generateQueryParamsForData } from '../../hooks/util/useQueryParam';
import {
  shortNameToDisplay,
  shortToFriendly,
} from '../../hooks/util/cloudProviderMaps';
import {
  CloudAccountsSort,
  CloudAccountsSortDirection,
  CloudAccountsSortField,
} from '../../state/cloudAccounts';

type CloudAccountProps = {
  cloudAccounts: CloudAccount[];
  sort: CloudAccountsSort;
  onSortChange: (sort: CloudAccountsSort) => void;
};

export const mapField = (field: CloudAccountsSortField) => {
  switch (field) {
    case 'providerAccountID':
      return 'id';
    case 'provider':
      return 'provider';
    case 'goldImageAccess':
      return 'goldImage';
    case 'dateAdded':
      return 'date';
  }
};

export const sortRowsForDev = (
  rows: CloudAccountRow[],
  sort: CloudAccountsSort
) => {
  return [...rows].sort((a, b) => {
    const aVal = a[mapField(sort.field)];
    const bVal = b[mapField(sort.field)];

    if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const CloudAccountsTable = ({
  cloudAccounts,
  sort,
  onSortChange,
}: CloudAccountProps) => {
  const rows: CloudAccountRow[] = cloudAccounts.map((acct) => ({
    id: acct.providerAccountID,
    provider: shortToFriendly[acct.shortName],
    providerLabel: shortNameToDisplay[acct.shortName],
    goldImage: acct.goldImageAccess as CloudAccountStatus,
    date: acct.dateAdded,
  }));

  const columns: {
    title: string;
    sortField?: CloudAccountsSortField;
  }[] = [
    { title: 'Cloud account', sortField: 'providerAccountID' },
    { title: 'Cloud provider', sortField: 'provider' },
    { title: 'Gold image access', sortField: 'goldImageAccess' },
    { title: 'Date added', sortField: 'dateAdded' },
  ];

  const activeSortIndex = columns.findIndex(
    (col) => col.sortField === sort.field
  );

  const onColumnSort = (
    _event: React.SyntheticEvent,
    columnIndex: number,
    direction: SortByDirection
  ) => {
    const sortField = columns[columnIndex]?.sortField;
    if (!sortField) {
      return;
    }

    onSortChange({
      field: sortField,
      direction: direction as CloudAccountsSortDirection,
    });
  };

  const displayRows =
    process.env.NODE_ENV === 'development' ? sortRowsForDev(rows, sort) : rows;

  return (
    <Table aria-label="Cloud accounts table" variant="compact">
      <Thead>
        <Tr>
          {columns.map((column, index) => (
            <Th
              key={column.title}
              sort={{
                sortBy: {
                  index: activeSortIndex,
                  direction: sort.direction as SortByDirection,
                },
                onSort: onColumnSort,
                columnIndex: index,
              }}
            >
              {column.title}
            </Th>
          ))}
          <Th screenReaderText="Actions" />
        </Tr>
      </Thead>
      <Tbody>
        {displayRows.map((row) => (
          <Tr key={row.id}>
            {' '}
            <Td>
              <Button variant="link" isInline component="a" href="">
                {row.id}
              </Button>
            </Td>
            <Td>
              <Link
                to={{
                  pathname: '/subscriptions/cloud-inventory/gold-images',
                  search: generateQueryParamsForData(
                    [row.provider],
                    'cloudProvider'
                  ).toString(),
                }}
              >
                {row.providerLabel}
              </Link>
            </Td>
            <Td>
              <span className="pf-v6-u-display-flex pf-v6-u-align-items-center">
                {getStatusIcon(row.goldImage, `Status: ${row.goldImage}`)}
                <Content className="pf-v6-u-ml-sm">{row.goldImage}</Content>
              </span>
            </Td>
            <Td>{formatDate(row.date)}</Td>
            <Td>
              <Button variant="link" isInline component="a">
                View Purchases
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
