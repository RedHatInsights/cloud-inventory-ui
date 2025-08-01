import { Pagination } from '@patternfly/react-core';
import { useAtom } from 'jotai';
import React from 'react';
import { goldImagePaginationData } from '../../state/goldImages';

interface GoldImagesPaginationProps {
  isCompact?: boolean;
}

export const GoldImagesPagination = ({
  isCompact = false,
}: GoldImagesPaginationProps) => {
  const [{ perPage, page, itemCount }, setGoldImagePagination] = useAtom(
    goldImagePaginationData
  );

  return (
    <Pagination
      perPage={perPage}
      page={page}
      itemCount={itemCount}
      isCompact={isCompact}
      onSetPage={(_event, newPage) => {
        setGoldImagePagination({
          perPage,
          itemCount,
          page: newPage,
        });
      }}
      onPerPageSelect={(_event, newPerPage, newPage) => {
        setGoldImagePagination({
          itemCount,
          perPage: newPerPage,
          page: newPage,
        });
      }}
    />
  );
};
