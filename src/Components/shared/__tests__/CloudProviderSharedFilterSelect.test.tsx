import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { atom } from 'jotai';
import { CloudProviderSharedFilterSelect } from '../CloudProviderSharedFilterSelect';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { renderWithRouter } from '../../../utils/testing/customRender';
const testAtom = atom<string[]>([]);

const FilterSelectWithState = ({
  init = [] as string[],
  isSplitButton = true,
}) => (
  <HydrateAtomsTestProvider initialValues={[[testAtom, init]]}>
    {' '}
    <CloudProviderSharedFilterSelect
      filterAtom={testAtom}
      queryParamKey="testParam"
      selectOptions={['aws', 'gcp', 'azure']}
      labelMap={{ aws: 'Amazon', gcp: 'Google', azure: 'Microsoft' }}
      isSplitButton={isSplitButton}
    />
     {' '}
  </HydrateAtomsTestProvider>
);
describe('CloudProviderSharedFilterSelect', () => {
  it('renders the toggle with the correct placeholder text', () => {
    renderWithRouter(<FilterSelectWithState />);
    expect(screen.getByText('Filter by cloud provider')).toBeInTheDocument();
  });

  it('renders as a standard toggle when isSplitButton is false', () => {
    renderWithRouter(<FilterSelectWithState isSplitButton={false} />);
    expect(screen.queryByText('Cloud Provider')).not.toBeInTheDocument();
  });

  it('displays mapped labels in the dropdown menu', () => {
    renderWithRouter(<FilterSelectWithState />);
    const toggle = screen.getByText('Filter by cloud provider');
    fireEvent.click(toggle);
    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.queryByText('aws')).not.toBeInTheDocument();
  });

  it('toggles the menu open and closed', () => {
    renderWithRouter(<FilterSelectWithState />);
    const toggle = screen.getByText('Filter by cloud provider');
    fireEvent.click(toggle);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('displays all available provider options in the dropdown', () => {
    renderWithRouter(<FilterSelectWithState />);

    const toggle = screen.getByText('Filter by cloud provider');
    fireEvent.click(toggle);

    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Microsoft')).toBeInTheDocument();
  });

  it('displays all available provider options in the dropdown', () => {
    renderWithRouter(<FilterSelectWithState />);
    const toggle = screen.getByText('Filter by cloud provider');
    fireEvent.click(toggle);
    expect(screen.getByText('Amazon')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Microsoft')).toBeInTheDocument();
  });
});
