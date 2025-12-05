import React from 'react';
import { render } from '@testing-library/react';
import { CloudAccountsToolbar } from '../CloudAccountsToolbar';

jest.mock('../CloudAccountsFilterSelect', () => ({
  CloudAccountsFilterSelect: () => (
    <div data-testid="cloud-accounts-filter-select" />
  ),
}));
jest.mock('../CloudAccountsFilterList', () => ({
  CloudAccountsFilterList: () => (
    <div data-testid="cloud-accounts-filter-list" />
  ),
}));
jest.mock('../CloudAccountsPagination', () => ({
  CloudAccountsPagination: ({ isCompact }: { isCompact?: boolean }) => (
    <div data-testid="cloud-accounts-pagination">
      {isCompact ? 'compact' : 'not-compact'}
    </div>
  ),
}));
describe('CloudAccountsToolbar', () => {
  it('renders', () => {
    const { container } = render(<CloudAccountsToolbar />);
    expect(container).toBeInTheDocument();
  });
  it('renders CloudAccountsFilterSelect', () => {
    const { getByTestId } = render(<CloudAccountsToolbar />);
    expect(getByTestId('cloud-accounts-filter-select')).toBeInTheDocument();
  });
  it('renders CloudAccountsPagination as compact', () => {
    const { getByTestId } = render(<CloudAccountsToolbar />);
    expect(getByTestId('cloud-accounts-pagination').textContent).toBe(
      'compact'
    );
  });
  it('renders CloudAccountsFilterList', () => {
    const { getByTestId } = render(<CloudAccountsToolbar />);
    expect(getByTestId('cloud-accounts-filter-list')).toBeInTheDocument();
  });
  it('renders two toolbars (top and bottom)', () => {
    const { container } = render(<CloudAccountsToolbar />);
    const toolbars = container.querySelectorAll('.pf-v6-c-toolbar');
    expect(toolbars.length).toBe(2);
  });
  it('top toolbar renders filter select and pagination in correct order', () => {
    const { container, getByTestId } = render(<CloudAccountsToolbar />);

    const firstToolbar = container.querySelectorAll('.pf-v6-c-toolbar')[0];
    expect(firstToolbar).toBeInTheDocument();

    const children = firstToolbar.querySelectorAll('[data-testid]');
    expect(children.length).toBe(2);

    expect(children[0]).toBe(getByTestId('cloud-accounts-filter-select'));
    expect(children[1]).toBe(getByTestId('cloud-accounts-pagination'));
  });
  it('bottom toolbar renders only CloudAccountsFilterList', () => {
    const { container, getByTestId } = render(<CloudAccountsToolbar />);

    const toolbars = container.querySelectorAll('.pf-v6-c-toolbar');
    const bottomToolbar = toolbars[1];

    expect(bottomToolbar).toBeInTheDocument();
    expect(
      bottomToolbar.querySelector('[data-testid="cloud-accounts-filter-list"]')
    ).toBe(getByTestId('cloud-accounts-filter-list'));

    expect(bottomToolbar.querySelectorAll('[data-testid]').length).toBe(1);
  });
});
