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
import { useTableSort } from '../../hooks/util/tables/useTableSort';
import { CloudAccountRow } from './types';
import { CloudAccount } from '../../hooks/api/useCloudAccounts';
import { CloudAccountStatus, getStatusIcon } from './GetStatusIcon';
import { formatDate } from '../../hooks/util/dates';
import { generateQueryParamsForData } from '../../hooks/util/useQueryParam';
import { Link } from 'react-router-dom';
import {
  shortNameToDisplay,
  shortToFriendly,
} from '../../hooks/util/cloudProviderMaps';
import { CloudAccountsSort } from '../../state/cloudAccounts';

type CloudAccountProps = {
  cloudAccounts: CloudAccount[];
  sort: CloudAccountsSort;
  onSortChange: (sort: CloudAccountsSort) => void;
};

export const CloudAccountsTable = ({ cloudAccounts }: CloudAccountProps) => {
  const rows: CloudAccountRow[] = cloudAccounts.map((acct) => ({
    id: acct.providerAccountID,
    provider: shortToFriendly[acct.shortName],
    providerLabel: shortNameToDisplay[acct.shortName],
    goldImage: acct.goldImageAccess as CloudAccountStatus,
    date: acct.dateAdded,
  }));

  const { sorted, getSortParams } = useTableSort(rows, 'cloudAccounts', {
    rowTranslator: (row) => [row.id, row.provider, row.goldImage, row.date],
    initialSort: {
      index: 0,
      dir: SortByDirection.asc,
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
        {sorted.map((row) => (
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
                {row.providerLabel}
              </Link>
            </Td>

            <Td>
              <span className="pf-v6-u-display-flex pf-v6-u-align-items-center">
                {getStatusIcon(
                  row.goldImage as CloudAccountStatus,
                  `Status: ${row.goldImage}`
                )}
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
