import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { FilterListBase } from '../FilterListBase';
import { atom } from 'jotai';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { renderWithRouter } from '../../../utils/testing/customRender';

const testAtom = atom<string[]>([]);
const setup = (values: string[] = []) => {
  return renderWithRouter(
    <HydrateAtomsTestProvider initialValues={[[testAtom, values]]}>
      <FilterListBase
        atom={testAtom}
        queryParam="cloudAccount"
        label="Cloud account"
      />
    </HydrateAtomsTestProvider>
  );
};

describe('FilterListBase', () => {
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
    expect(screen.queryByText('acct-1')).not.toBeInTheDocument();
    expect(screen.getByText('acct-2')).toBeInTheDocument();
  });
  it('shows Clear filters button when values exist', () => {
    setup(['acct-1']);
    expect(screen.getByText('Clear filters')).toBeInTheDocument();
  });
  it('clears all filters when Clear filters is clicked', () => {
    setup(['acct-1', 'acct-2']);
    fireEvent.click(screen.getByText('Clear filters'));
    expect(screen.queryByText('acct-1')).not.toBeInTheDocument();
    expect(screen.queryByText('acct-2')).not.toBeInTheDocument();
  });
});
