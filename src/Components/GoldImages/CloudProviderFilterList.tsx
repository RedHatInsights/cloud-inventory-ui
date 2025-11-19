import React from 'react';
import { cloudProviderFilterData } from '../../state/goldImages';
import { CloudProviderFilterListBase } from '../shared/CloudProviderFilterListBase';

export const CloudProviderFilterList = () => {
  return <CloudProviderFilterListBase atom={cloudProviderFilterData} />;
};
