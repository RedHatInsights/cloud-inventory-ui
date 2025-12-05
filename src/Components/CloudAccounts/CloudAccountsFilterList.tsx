import React from 'react';
import { FilterListBase } from '../shared/FilterListBase';
import { cloudAccountsAccountFilterData } from '../../state/cloudAccounts';

export const CloudAccountsFilterList = () => {
  return (
    <FilterListBase
      atom={cloudAccountsAccountFilterData}
      queryParam="cloud account"
      label="Cloud account"
    />
  );
};
