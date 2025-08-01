import React from 'react';
import { GoldImagesPagination } from '../GoldImagesPagination';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { goldImagePaginationData } from '../../../state/goldImages';
import { fireEvent, render, waitFor } from '@testing-library/react';

const GoldImagesPaginationWithState = ({
  init,
}: {
  init: { page: number; perPage: number; itemCount: number };
}) => (
  <HydrateAtomsTestProvider initialValues={[[goldImagePaginationData, init]]}>
    <GoldImagesPagination />
  </HydrateAtomsTestProvider>
);

describe('Gold Images Pagination', () => {
  it('renders', () => {
    const { container } = render(<GoldImagesPagination />);

    expect(
      container.querySelector('.pf-v6-c-pagination__total-items')?.firstChild
        ?.textContent
    ).toBe('0 - 0');
  });

  it('can go to the next page', async () => {
    const { container } = render(
      <GoldImagesPaginationWithState
        init={{ page: 1, perPage: 10, itemCount: 123 }}
      />
    );

    const nextButton = container.querySelector(
      '[aria-label="Go to next page"]'
    );

    if (!nextButton) {
      throw new Error('Next page button not found');
    }

    await waitFor(() =>
      expect(
        container.querySelector('.pf-v6-c-pagination__total-items')?.firstChild
          ?.textContent
      ).toBe('1 - 10')
    );

    fireEvent.click(nextButton);

    await waitFor(() =>
      expect(
        container.querySelector('.pf-v6-c-pagination__total-items')?.firstChild
          ?.textContent
      ).toBe('11 - 20')
    );
  });

  it('can go back a page', async () => {
    const { container } = render(
      <GoldImagesPaginationWithState
        init={{ page: 2, perPage: 10, itemCount: 123 }}
      />
    );

    const previousButton = container.querySelector(
      '[aria-label="Go to previous page"]'
    );

    if (!previousButton) {
      throw new Error('Next page button not found');
    }

    await waitFor(() =>
      expect(
        container.querySelector('.pf-v6-c-pagination__total-items')?.firstChild
          ?.textContent
      ).toBe('11 - 20')
    );

    fireEvent.click(previousButton);

    await waitFor(() =>
      expect(
        container.querySelector('.pf-v6-c-pagination__total-items')?.firstChild
          ?.textContent
      ).toBe('1 - 10')
    );
  });

  it('can change page size', async () => {
    const { container, queryByText } = render(
      <GoldImagesPaginationWithState
        init={{ page: 1, perPage: 10, itemCount: 123 }}
      />
    );

    const expandPageSelectionButton = container.querySelector(
      '[data-ouia-component-type="PF6/MenuToggle"]'
    );

    if (!expandPageSelectionButton) {
      throw new Error('Page size selector not found');
    }

    await waitFor(() =>
      expect(
        container.querySelector('.pf-v6-c-pagination__total-items')?.firstChild
          ?.textContent
      ).toBe('1 - 10')
    );

    fireEvent.click(expandPageSelectionButton);

    const twentyPerPageSelectionButton = await waitFor(
      () => queryByText('20 per page')?.parentElement?.parentElement
    );

    if (!twentyPerPageSelectionButton) {
      throw new Error('Set page size to 20 button not found');
    }

    fireEvent.click(twentyPerPageSelectionButton);

    await waitFor(() =>
      expect(
        container.querySelector('.pf-v6-c-pagination__total-items')?.firstChild
          ?.textContent
      ).toBe('1 - 20')
    );
  });
});
