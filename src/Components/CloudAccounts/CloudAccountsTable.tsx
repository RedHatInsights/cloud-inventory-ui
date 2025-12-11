import React, { useEffect } from 'react';
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
import {
  CloudProviderLabelMap,
  providerToApiParam,
} from './CloudAccountsUtils';
import { getStatusIcon } from './GetStatusIcon';
import { formatDate } from '../../hooks/util/dates';
import { toCloudAccountStatus } from './GetStatusIcon';
import { CloudAccountsPaginationData } from '../../state/cloudAccounts';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';

type CloudAccountProps = {
  cloudAccounts: CloudAccount[];
};

export const CloudAccountsTable = ({ cloudAccounts }: CloudAccountProps) => {
  const [pagination, setPagination] = useQueryParamInformedAtom(
    CloudAccountsPaginationData,
    'pagination'
  );
  const { page, perPage } = pagination;

  useEffect(() => {
    setPagination({
      ...pagination,
      itemCount: cloudAccounts.length,
    });
  }, [cloudAccounts.length]);

  const rows: CloudAccountRow[] = cloudAccounts.map((acct) => ({
    id: acct.providerAccountID,
    provider: CloudProviderLabelMap[acct.shortName],
    goldImage: acct.goldImageAccess,
    date: acct.dateAdded,
  }));

  const { sorted, getSortParams } = useTableSort(rows, 'cloudAccounts', {
    rowTranslator: (row) => [row.id, row.provider, row.goldImage, row.date],
    initialSort: {
      index: 0,
      dir: SortByDirection.asc,
    },
  });
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedCloudAccounts = sorted.slice(start, end);

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
        {paginatedCloudAccounts.map((row) => (
          <Tr key={row.id}>
            <Td>
              <Button variant="link" isInline component="a" href="">
                {row.id}
              </Button>
            </Td>

            <Td>
              <Button
                variant="link"
                isInline
                component="a"
                href={`/subscriptions/cloud-inventory/gold-images?provider=${encodeURIComponent(
                  providerToApiParam[row.provider]
                )}
                `}
              >
                {row.provider}
              </Button>
            </Td>

            <Td>
              <span className="pf-v6-u-display-flex pf-v6-u-align-items-center">
                {getStatusIcon(
                  toCloudAccountStatus(row.goldImage),
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
