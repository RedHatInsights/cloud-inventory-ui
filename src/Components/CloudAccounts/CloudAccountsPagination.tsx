import React from 'react';
import { cloudAccountsPaginationData } from '../../state/cloudAccounts';
import { PaginationBase } from '../shared/PaginationBase';

export const CloudAccountsPagination = ({ isCompact = false }) => {
  return (
    <PaginationBase atom={cloudAccountsPaginationData} isCompact={isCompact} />
  );
};
