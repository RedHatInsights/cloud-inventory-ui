import React from 'react';
import { goldImagePaginationData } from '../../state/goldImages';
import { PaginationBase } from '../shared/PaginationBase';

export const GoldImagesPagination = ({ isCompact = false }) => {
  return (
    <PaginationBase atom={goldImagePaginationData} isCompact={isCompact} />
  );
};
