import React from 'react';
import { Pagination } from '@patternfly/react-core';
import { PrimitiveAtom } from 'jotai';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';

interface PaginationBaseProps {
  atom: PrimitiveAtom<{
    page: number;
    perPage: number;
    itemCount: number;
  }>;
  isCompact?: boolean;
}

export const PaginationBase = ({
  atom,
  isCompact = false,
}: PaginationBaseProps) => {
  const [{ perPage, page, itemCount }, setPagination] =
    useQueryParamInformedAtom(atom, 'pagination');

  return (
    <Pagination
      perPage={perPage}
      page={page}
      itemCount={itemCount}
      isCompact={isCompact}
      onSetPage={(_evt, newPage) => {
        setPagination({
          perPage,
          itemCount,
          page: newPage,
        });
      }}
      onPerPageSelect={(_evt, newPerPage, newPage) => {
        setPagination({
          itemCount,
          perPage: newPerPage,
          page: newPage,
        });
      }}
    />
  );
};
