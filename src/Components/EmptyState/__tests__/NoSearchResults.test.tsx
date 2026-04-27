import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { useAtomValue } from 'jotai';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import {
  CloudAccountsPaginationData,
  cloudAccountIDFilterData,
  cloudProviderFilterData,
  goldImageStatusFilterData,
} from '../../../state/cloudAccounts';
import { CloudProviderShortname } from '../../../types/cloudAccountsTypes';
import { NoSearchResults } from '../NoSearchResults';

const NoSearchResultsWithState = () => {
  const StateObserver = () => {
    const pagination = useAtomValue(CloudAccountsPaginationData);
    const providers = useAtomValue(cloudProviderFilterData);
    const statuses = useAtomValue(goldImageStatusFilterData);
    const accountID = useAtomValue(cloudAccountIDFilterData);

    return (
      <>
        <div data-testid="pagination">{JSON.stringify(pagination)}</div>
        <div data-testid="providers">{JSON.stringify(providers)}</div>
        <div data-testid="statuses">{JSON.stringify(statuses)}</div>
        <div data-testid="account-id">{JSON.stringify(accountID)}</div>
      </>
    );
  };

  return (
    <HydrateAtomsTestProvider
      initialValues={[
        [CloudAccountsPaginationData, { page: 3, perPage: 10, itemCount: 25 }],
        [cloudProviderFilterData, [CloudProviderShortname.AWS]],
        [goldImageStatusFilterData, ['available']],
        [cloudAccountIDFilterData, 'abc123'],
      ]}
    >
      <NoSearchResults />
      <StateObserver />
    </HydrateAtomsTestProvider>
  );
};

describe('NoSearchResults', () => {
  it('renders the no results message', () => {
    renderWithRouter(<NoSearchResultsWithState />);

    expect(
      screen.getByText(/no results found\. try adjusting your filters\./i),
    ).toBeInTheDocument();
  });

  it('renders the clear all filters button', () => {
    renderWithRouter(<NoSearchResultsWithState />);

    expect(
      screen.getByRole('button', { name: /clear all filters/i }),
    ).toBeInTheDocument();
  });

  it('clears filters and resets pagination when clear all filters is clicked', () => {
    renderWithRouter(<NoSearchResultsWithState />);

    fireEvent.click(screen.getByRole('button', { name: /clear all filters/i }));

    expect(screen.getByTestId('providers')).toHaveTextContent('[]');
    expect(screen.getByTestId('statuses')).toHaveTextContent('[]');
    expect(screen.getByTestId('account-id')).toHaveTextContent('""');
    expect(screen.getByTestId('pagination')).toHaveTextContent(
      '{"page":1,"perPage":10,"itemCount":25}',
    );
  });
});
