import React from 'react';
import { CloudAccountsPaginationData } from '../../state/cloudAccounts';
import { PaginationBase } from '../shared/PaginationBase';

export const CloudAccountsPagination = ({ isCompact = false }) => {
  return (
    <PaginationBase atom={CloudAccountsPaginationData} isCompact={isCompact} />
  );
};
