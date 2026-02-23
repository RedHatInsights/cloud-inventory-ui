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
import { useAtomValue } from 'jotai';
import {
  cloudProviderFilterData,
  goldImagePaginationData,
} from '../../state/goldImages';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { hasPaginationError } from '../../utils/errors';
import { PaginationError } from '../shared/PaginationError';

interface GoldImagesProps {
  goldImages: GoldImagesResponse;
}

export const GoldImagesTable = ({ goldImages }: GoldImagesProps) => {
  const [pageOptions, setGoldImagePagination] = useQueryParamInformedAtom(
    goldImagePaginationData,
    'pagination',
  );
  const cloudProviderFilter = useAtomValue(cloudProviderFilterData);

  const onInvalidPage = hasPaginationError(pageOptions);

  const filteredGoldImages =
    cloudProviderFilter.length == 0
      ? Object.values(goldImages)
      : Object.values(goldImages).filter((cloudProvider) =>
          cloudProviderFilter.includes(cloudProvider.provider),
        );

  const { sorted, getSortParams } = useTableSort(
    filteredGoldImages,
    'goldImages',
    {
      rowTranslator: (hyperscaler) => [hyperscaler.provider],
      initialSort: {
        dir: SortByDirection.asc,
        index: 0,
      },
    },
  );

  const paginatedGoldImage = sorted.slice(
    (pageOptions.page - 1) * pageOptions.perPage,
    pageOptions.page * pageOptions.perPage,
  );

  useEffect(() => {
    setGoldImagePagination({
      ...pageOptions,
      itemCount: filteredGoldImages.length,
    });
  }, [cloudProviderFilter, filteredGoldImages.length]);

  if (onInvalidPage) {
    return (
      <PaginationError
        pagination={pageOptions}
        setPagination={setGoldImagePagination}
      />
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th sort={getSortParams(0)}>Cloud provider</Th>
        </Tr>
      </Thead>
      <Tbody>
        {paginatedGoldImage.map((hyperscaler, i) => {
          return (
            <Tr key={`hyperscaler.provider-${i}`}>
              <Td>
                <b>{hyperscaler.provider}</b>
                {hyperscaler.goldImages.map((goldImage, i) => {
                  return (
                    <Content key={i} className="pf-v6-u-ml-sm">
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
