import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { MarketplacePurchasesToolbar } from '../MarketplacePurchasesToolbar';
import { MarketplacePurchasesPaginationData } from '../../../state/marketplacePurchases';

const renderToolbar = () =>
  renderWithRouter(
    <HydrateAtomsTestProvider
      initialValues={[
        [
          MarketplacePurchasesPaginationData,
          {
            page: 1,
            perPage: 10,
            itemCount: 25
          }
        ]
      ]}
    >
      <MarketplacePurchasesToolbar />
    </HydrateAtomsTestProvider>
  );

describe('MarketplacePurchasesToolbar', () => {
  it('renders the toolbar', () => {
    const { container } = renderToolbar();
    expect(container.querySelector('#marketplace-purchases-toolbar')).toBeInTheDocument();
  });
  it('renders the compact pagination component', () => {
    renderToolbar();
    expect(
      screen.getByRole('button', {
        name: /1\s*[–-]\s*10 of 25/i
      })
    ).toBeInTheDocument();
  });
});
