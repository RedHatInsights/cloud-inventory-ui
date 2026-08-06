import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { MarketplacePurchasesPagination } from '../MarketplacePurchasesPagination';
import { MarketplacePurchasesPaginationData } from '../../../state/marketplacePurchases';

const MarketplacePurchasesPaginationWithState = ({
  init
}: {
  init: {
    page: number;
    perPage: number;
    itemCount: number;
  };
}) => (
  <HydrateAtomsTestProvider initialValues={[[MarketplacePurchasesPaginationData, init]]}>
    <MarketplacePurchasesPagination />
  </HydrateAtomsTestProvider>
);

describe('Marketplace Purchases Pagination', () => {
  it('renders', () => {
    const { container } = renderWithRouter(<MarketplacePurchasesPagination />);

    expect(container.querySelector('.pf-v6-c-pagination__total-items')?.textContent).toContain(
      '0 - 0'
    );
  });

  it('goes to the next page', async () => {
    const { container } = renderWithRouter(
      <MarketplacePurchasesPaginationWithState
        init={{
          page: 1,
          perPage: 10,
          itemCount: 150
        }}
      />
    );

    const nextButton = container.querySelector('[aria-label="Go to next page"]');

    if (!nextButton) {
      throw new Error('Next page button not found');
    }

    await waitFor(() => {
      expect(container.querySelector('.pf-v6-c-pagination__total-items')?.textContent).toContain(
        '1 - 10 of 150'
      );
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(container.querySelector('.pf-v6-c-pagination__total-items')?.textContent).toContain(
        '11 - 20 of 150'
      );
    });
  });

  it('goes to the previous page', async () => {
    const { container } = renderWithRouter(
      <MarketplacePurchasesPaginationWithState
        init={{
          page: 2,
          perPage: 10,
          itemCount: 150
        }}
      />
    );

    const previousButton = container.querySelector('[aria-label="Go to previous page"]');

    if (!previousButton) {
      throw new Error('Previous page button not found');
    }

    await waitFor(() => {
      expect(container.querySelector('.pf-v6-c-pagination__total-items')?.textContent).toContain(
        '11 - 20 of 150'
      );
    });

    fireEvent.click(previousButton);

    await waitFor(() => {
      expect(container.querySelector('.pf-v6-c-pagination__total-items')?.textContent).toContain(
        '1 - 10 of 150'
      );
    });
  });

  it('disables previous page on the first page', () => {
    const { container } = renderWithRouter(
      <MarketplacePurchasesPaginationWithState
        init={{
          page: 1,
          perPage: 10,
          itemCount: 150
        }}
      />
    );

    expect(container.querySelector('[aria-label="Go to previous page"]')).toBeDisabled();
  });
});
