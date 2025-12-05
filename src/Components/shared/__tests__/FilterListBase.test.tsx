import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { FilterListBase } from '../FilterListBase';
import { atom } from 'jotai';
import { useQueryParamInformedAtom } from '../../../hooks/util/useQueryParam';

const mockSetValues = jest.fn();
jest.mock('../../../hooks/util/useQueryParam', () => ({
  useQueryParamInformedAtom: jest.fn(),
}));
const testAtom = atom<string[]>([]);
const setup = (values: string[] = []) => {
  (useQueryParamInformedAtom as jest.Mock).mockReturnValue([
    values,
    mockSetValues,
  ]);
  return render(
    <FilterListBase
      atom={testAtom}
      queryParam="cloudAccount"
      label="Cloud account"
    />
  );
};
describe('FilterListBase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders nothing when there are no values', () => {
    setup([]);
    expect(screen.queryByText('Clear filters')).not.toBeInTheDocument();
  });
  it('renders labels for each filter value', () => {
    setup(['acct-1', 'acct-2']);
    expect(screen.getByText('acct-1')).toBeInTheDocument();
    expect(screen.getByText('acct-2')).toBeInTheDocument();
  });
  it('removes a single value when its label is closed', () => {
    setup(['acct-1', 'acct-2']);

    const closeButtons = screen.getAllByRole('button', { name: /close/i });

    fireEvent.click(closeButtons[0]);

    expect(mockSetValues).toHaveBeenCalledWith(['acct-2']);
  });
  it('shows Clear filters button when values exist', () => {
    setup(['acct-1']);
    expect(screen.getByText('Clear filters')).toBeInTheDocument();
  });
  it('clears all filters when Clear filters is clicked', () => {
    setup(['acct-1', 'acct-2']);
    fireEvent.click(screen.getByText('Clear filters'));
    expect(mockSetValues).toHaveBeenCalledWith([]);
  });
});
