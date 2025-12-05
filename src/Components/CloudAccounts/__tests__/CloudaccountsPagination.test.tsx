import React from 'react';
import { render } from '@testing-library/react';
import { CloudAccountsPagination } from '../CloudAccountsPagination';
import { cloudAccountsPaginationData } from '../../../state/cloudAccounts';

jest.mock('../../shared/PaginationBase', () => ({
  PaginationBase: ({ atom, isCompact }: never) => (
    <div
      data-testid="pagination-base"
      data-compact={isCompact}
      data-atom={
        atom === cloudAccountsPaginationData ? 'correct-atom' : 'wrong-atom'
      }
    />
  ),
}));

describe('CloudAccountsPagination', () => {
  it('renders', () => {
    const { getByTestId } = render(<CloudAccountsPagination />);
    expect(getByTestId('pagination-base')).toBeInTheDocument();
  });

  it('passes the correct pagination atom', () => {
    const { getByTestId } = render(<CloudAccountsPagination />);
    expect(getByTestId('pagination-base').getAttribute('data-atom')).toBe(
      'correct-atom'
    );
  });

  it('defaults isCompact to false', () => {
    const { getByTestId } = render(<CloudAccountsPagination />);
    expect(getByTestId('pagination-base').getAttribute('data-compact')).toBe(
      'false'
    );
  });

  it('passes isCompact=true when provided', () => {
    const { getByTestId } = render(<CloudAccountsPagination isCompact />);
    expect(getByTestId('pagination-base').getAttribute('data-compact')).toBe(
      'true'
    );
  });
});
