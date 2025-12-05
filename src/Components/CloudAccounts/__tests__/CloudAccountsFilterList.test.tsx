import React from 'react';
import { render } from '@testing-library/react';
import { CloudAccountsFilterList } from '../CloudAccountsFilterList';
import { cloudAccountsAccountFilterData } from '../../../state/cloudAccounts';
import { FilterListBase } from '../../shared/FilterListBase';

jest.mock('../../shared/FilterListBase', () => ({
  __esModule: true,
  FilterListBase: jest.fn(() => <div>Filter List Base</div>),
}));

const mockedFilterListBase = FilterListBase as jest.Mock;

describe('CloudAccountsFilterList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders FilterListBase with the correct props', () => {
    render(<CloudAccountsFilterList />);

    expect(mockedFilterListBase).toHaveBeenCalledTimes(1);

    const call = mockedFilterListBase.mock.calls[0][0];

    expect(call.atom).toBe(cloudAccountsAccountFilterData);
    expect(call.queryParam).toBe('cloud account');
    expect(call.label).toBe('Cloud account');
  });
});
