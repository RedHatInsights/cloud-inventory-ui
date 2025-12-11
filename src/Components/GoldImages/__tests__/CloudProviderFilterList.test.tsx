import React from 'react';
import { render } from '@testing-library/react';
import { CloudProviderFilterList } from '../CloudProviderFilterList';
import { cloudProviderFilterData } from '../../../state/goldImages';
import { FilterListBase } from '../../shared/FilterListBase';

jest.mock('../../shared/FilterListBase', () => ({
  __esModule: true,
  FilterListBase: jest.fn(() => <div>Filter List Base</div>),
}));

const mockedFilterListBase = FilterListBase as jest.Mock;

describe('CloudProviderFilterList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders FilterListBase with the correct props', () => {
    render(<CloudProviderFilterList />);

    expect(mockedFilterListBase).toHaveBeenCalledTimes(1);

    const call = mockedFilterListBase.mock.calls[0][0];

    expect(call.atom).toBe(cloudProviderFilterData);
    expect(call.queryParam).toBe('cloudProvider');
    expect(call.label).toBe('Cloud Provider');
  });
});
