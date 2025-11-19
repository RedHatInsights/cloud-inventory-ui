import React from 'react';
import { CloudProviderFilterListBase } from '../shared/CloudProviderFilterListBase';
import { cloudAccountsFilterData } from '../../state/cloudAccounts';

export const CloudAccountsFilterList = () => {
  return <CloudProviderFilterListBase atom={cloudAccountsFilterData} />;
};
