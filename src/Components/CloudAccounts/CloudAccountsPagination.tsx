import { Pagination } from '@patternfly/react-core';
import React from 'react';
import { cloudAccountsPaginationData } from '../../state/cloudAccounts';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';

interface CloudAccountsPaginationProps {
  isCompact?: boolean;
}

export const CloudAccountsPagination = ({
  isCompact = false,
}: CloudAccountsPaginationProps) => {
  const [{ perPage, page, itemCount }, setCloudAccountsPagination] =
    useQueryParamInformedAtom(cloudAccountsPaginationData, 'pagination');

  return (
    <Pagination
      perPage={perPage}
      page={page}
      itemCount={itemCount}
      isCompact={isCompact}
      onSetPage={(_event, newPage) => {
        setCloudAccountsPagination({
          perPage,
          itemCount,
          page: newPage,
        });
      }}
      onPerPageSelect={(_event, newPerPage, newPage) => {
        setCloudAccountsPagination({
          itemCount,
          perPage: newPerPage,
          page: newPage,
        });
      }}
    />
  );
};
