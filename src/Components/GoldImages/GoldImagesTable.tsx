import React, { useEffect } from 'react';
import { GoldImagesResponse } from '../../hooks/api/useGoldImages';
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
import { useTableSort } from '../../hooks/util/tables/useTableSort';
import { useAtom, useAtomValue } from 'jotai';
import {
  cloudProviderFilterData,
  goldImagePaginationData,
} from '../../state/goldImages';

interface GoldImagesProps {
  goldImages: GoldImagesResponse;
}

export const GoldImagesTable = ({ goldImages }: GoldImagesProps) => {
  const [pageOptions, setGoldImagePagination] = useAtom(
    goldImagePaginationData
  );
  const cloudProviderFilter = useAtomValue(cloudProviderFilterData);

  const filteredGoldImages =
    cloudProviderFilter.length == 0
      ? Object.values(goldImages)
      : Object.values(goldImages).filter((cloudProvider) =>
          cloudProviderFilter.includes(cloudProvider.provider)
        );

  const { sorted, getSortParams } = useTableSort(filteredGoldImages, {
    rowTranslator: (hyperscaler) => [hyperscaler.provider],
    initialSort: {
      dir: SortByDirection.asc,
      index: 0,
    },
  });

  const paginatedGoldImage = sorted.slice(
    (pageOptions.page - 1) * pageOptions.perPage,
    pageOptions.page * pageOptions.perPage
  );

  useEffect(() => {
    setGoldImagePagination({
      ...pageOptions,
      itemCount: filteredGoldImages.length,
    });
  }, [cloudProviderFilter]);

  return (
    <Table>
      <Thead>
        <Tr>
          <Th sort={getSortParams(0)}>Cloud provider</Th>
        </Tr>
      </Thead>
      <Tbody>
        {paginatedGoldImage.map((hyperscaler) => {
          return (
            <Tr key={hyperscaler.provider}>
              <Td>
                <b>{hyperscaler.provider}</b>
                {hyperscaler.goldImages.map((goldImage) => {
                  return (
                    <Content key={goldImage.name} className="pf-v6-u-ml-sm">
                      {goldImage.description}
                    </Content>
                  );
                })}
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
