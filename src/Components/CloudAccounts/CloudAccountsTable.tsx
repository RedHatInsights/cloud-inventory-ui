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
import { shortToFriendly } from '../../hooks/util/cloudProviderMaps';
import { CloudAccountsSortField } from '../../state/cloudAccounts';
import { useApiBasedTableSort } from '../../hooks/util/tables/useTableSort';

type CloudAccountProps = {
  cloudAccounts: CloudAccount[];
  sortBy?: string;
  sortDir?: SortByDirection;
  setSortBy: (sortBy: string) => void;
  setSortDir: (sortBy: SortByDirection) => void;
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

export const CloudAccountsTable = ({
  cloudAccounts,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
}: CloudAccountProps) => {
  const rows: CloudAccountRow[] = cloudAccounts.map((acct) => ({
    id: acct.providerAccountID,
    provider: shortToFriendly[acct.shortName],
    goldImage: acct.goldImageAccess as CloudAccountStatus,
    date: acct.dateAdded,
  }));

  const displayRows = rows;

  const { getSortParams } = useApiBasedTableSort('cloudAccountsSort', {
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    lookup: {
      0: 'providerAccountID',
      1: 'shortName',
      2: 'goldImageAccess',
      3: 'dateAdded',
    },
  });

  return (
    <Table aria-label="Cloud accounts table" variant="compact">
      <Thead>
        <Tr>
          <Th sort={getSortParams(0)}>Cloud account</Th>
          <Th sort={getSortParams(1)}>Cloud provider</Th>
          <Th sort={getSortParams(2)}>Gold image access</Th>
          <Th sort={getSortParams(3)}>Date added</Th>
          <Th screenReaderText="Actions" />
        </Tr>
      </Thead>
      <Tbody>
        {displayRows.map((row) => (
          <Tr key={row.id}>
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
                {row.provider}
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
