import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { NoSearchResults } from '../NoSearchResults';

describe('NoSearchResults', () => {
  it('renders the no results message', () => {
    renderWithRouter(<NoSearchResults onClearFilters={jest.fn()} />);

    expect(
      screen.getByText(/no results found\. try adjusting your filters\./i)
    ).toBeInTheDocument();
  });

  it('renders the clear all filters button', () => {
    renderWithRouter(<NoSearchResults onClearFilters={jest.fn()} />);

    expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument();
  });

  it('calls onClearFilters when clear all filters is clicked', () => {
    const onClearFilters = jest.fn();

    renderWithRouter(<NoSearchResults onClearFilters={onClearFilters} />);

    fireEvent.click(screen.getByRole('button', { name: /clear all filters/i }));

    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });
});
