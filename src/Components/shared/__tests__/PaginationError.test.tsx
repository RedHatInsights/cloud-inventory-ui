import { render, screen } from '@testing-library/react';
import { PaginationError } from '../PaginationError';
import React from 'react';
import { PaginationData } from '../../../types/pagination';

describe('PaginationError', () => {
  const defaultPagination: PaginationData = {
    page: 5,
    perPage: 10,
    itemCount: 25,
  };

  it('renders the error message', () => {
    render(
      <PaginationError
        pagination={defaultPagination}
        setPagination={() => {}}
      />,
    );

    expect(
      screen.getByText(/No results for current page/i),
    ).toBeInTheDocument();
  });

  it('renders the return to page 1 button', () => {
    render(
      <PaginationError
        pagination={defaultPagination}
        setPagination={() => {}}
      />,
    );

    expect(
      screen.getByRole('button', { name: /return to page 1/i }),
    ).toBeInTheDocument();
  });

  it('renders as an empty state with large variant', () => {
    const { container } = render(
      <PaginationError
        pagination={defaultPagination}
        setPagination={() => {}}
      />,
    );

    const emptyState = container.querySelector('.pf-v6-c-empty-state');
    expect(emptyState).toBeInTheDocument();
  });
});
