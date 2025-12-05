import React from 'react';
import { cloudProviderFilterData } from '../../state/goldImages';
import { FilterListBase } from '../shared/FilterListBase';

export const CloudProviderFilterList = () => {
  return (
    <FilterListBase
      atom={cloudProviderFilterData}
      queryParam="cloudProvider"
      label="Cloud Provider"
    />
  );
};
