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
import { Content } from '@patternfly/react-core';
import { Button } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import { useTableSort } from '../../hooks/util/tables/useTableSort';

export const CloudAccountsTable = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Enabled':
      case 'Granted':
        return <CheckCircleIcon color="green" />;
      case 'Failed':
        return <ExclamationCircleIcon color="red" />;
      default:
        return null;
    }
  };

  const dummyData = [
    {
      id: '652039897783',
      provider: 'AWS',
      goldImage: 'Granted',
      date: '2024-05-02',
    },
    {
      id: '100000000000',
      provider: 'Azure',
      goldImage: 'Failed',
      date: '2024-04-08',
    },
  ];

  const { sorted, getSortParams } = useTableSort(dummyData, 'cloudAccounts', {
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
        </Tr>
      </Thead>
      <Tbody>
        {sorted.map((row) => (
          <Tr key={row.id}>
            <Td>
              <Button variant="link" isInline>
                {row.id}
              </Button>
            </Td>
            <Td>{row.provider}</Td>
            <Td>
              <span className="pf-v6-u-display-flex pf-v6-u-align-items-center">
                {getStatusIcon(row.goldImage)}
                <Content className="pf-v6-u-ml-sm">{row.goldImage}</Content>
              </span>
            </Td>
            {/* <Content className="pf-v6-u-ml-sm">{row.cloudAccounts}</Content>
            </Td> */}
            <Td>{row.date}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
