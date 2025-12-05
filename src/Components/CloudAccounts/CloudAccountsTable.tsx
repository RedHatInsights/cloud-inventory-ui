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
import { PROVIDER_MAP } from './CloudAccountsUtils';
import { providerToParam } from './CloudAccountsUtils';
import { getStatusIcon } from './GetStatusIcon';
import { formatDate } from '../../hooks/util/dates';
import { useAtomValue } from 'jotai';
import {
  cloudAccountsAccountFilterData,
  cloudAccountsGoldImageFilterData,
  cloudAccountsProviderFilterData,
} from '../../state/cloudAccounts';

type Props = {
  cloudAccounts: CloudAccount[];
};

export const CloudAccountsTable = ({ cloudAccounts }: Props) => {
  const cloudAccountFilter = useAtomValue(cloudAccountsAccountFilterData);
  const cloudProviderFilter = useAtomValue(cloudAccountsProviderFilterData);
  const cloudGoldImageFilter = useAtomValue(cloudAccountsGoldImageFilterData);

  const rows: CloudAccountRow[] = cloudAccounts
    .filter((acct) => {
      if (
        cloudAccountFilter.length > 0 &&
        !cloudAccountFilter.some((val) =>
          acct.providerAccountID.toLowerCase().includes(val.toLowerCase())
        )
      ) {
        return false;
      }

      if (
        cloudProviderFilter.length > 0 &&
        !cloudProviderFilter.includes(PROVIDER_MAP[acct.shortName])
      ) {
        return false;
      }

      if (
        cloudGoldImageFilter.length > 0 &&
        !cloudGoldImageFilter.includes(acct.goldImageAccess)
      ) {
        return false;
      }

      return true;
    })
    .map((acct) => ({
      id: acct.providerAccountID,
      provider: PROVIDER_MAP[acct.shortName],
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
              <Button
                variant="link"
                isInline
                component="a"
                href={`gold-images?provider=${providerToParam[row.provider]}`}
              >
                {row.provider}
              </Button>
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
