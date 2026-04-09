import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import NoSearchResults from '../NoSearchResults';

describe('NoSearchResults', () => {
  it('renders the no results heading and body text', () => {
    renderWithRouter(<NoSearchResults clearFilters={jest.fn()} />);

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(
      screen.getByText(
        /No results match the filter criteria\. Remove individual filters or clear all filters to show results\./i,
      ),
    ).toBeInTheDocument();
  });

  it('renders the clear all filters button', () => {
    renderWithRouter(<NoSearchResults clearFilters={jest.fn()} />);

    expect(
      screen.getByRole('button', { name: /clear all filters/i }),
    ).toBeInTheDocument();
  });

  it('calls clearFilters when clear all filters is clicked', () => {
    const clearFilters = jest.fn();

    renderWithRouter(<NoSearchResults clearFilters={clearFilters} />);

    fireEvent.click(screen.getByRole('button', { name: /clear all filters/i }));

    expect(clearFilters).toHaveBeenCalledTimes(1);
  });
});
