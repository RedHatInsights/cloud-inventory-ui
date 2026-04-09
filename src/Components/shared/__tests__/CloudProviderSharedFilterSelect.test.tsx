import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { atom } from 'jotai';
import { CloudProviderSharedFilterList } from '../CloudProviderSharedFilterList';
import { CloudProviderSharedFilterSelect } from '../CloudProviderSharedFilterSelect';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { renderWithRouter } from '../../../utils/testing/customRender';

const testAtom = atom<string[]>([]);

const FilterListWithState = ({
  init = [] as string[],
  labelMap = undefined as Record<string, string> | undefined,
}) => (
  <HydrateAtomsTestProvider initialValues={[[testAtom, init]]}>
        
    <CloudProviderSharedFilterList
      filterAtom={testAtom}
      queryParamKey="testParam"
      labelMap={labelMap}
    />
      
  </HydrateAtomsTestProvider>
);

const FilterHarness = ({
  init = [] as string[],
  labelMap = undefined as Record<string, string> | undefined,
}) => (
  <HydrateAtomsTestProvider initialValues={[[testAtom, init]]}>
        
    <CloudProviderSharedFilterSelect
      filterAtom={testAtom}
      queryParamKey="testParam"
      selectOptions={['aws', 'gcp', 'azure']}
      labelMap={labelMap}
      isSplitButton={false}
      toggleLabel="Filter by provider"
    />
        
    <CloudProviderSharedFilterList
      filterAtom={testAtom}
      queryParamKey="testParam"
      labelMap={labelMap}
    />
      
  </HydrateAtomsTestProvider>
);

describe('CloudProviderSharedFilterList', () => {
  it('returns null when no filters are present', () => {
    const { container } = renderWithRouter(<FilterListWithState init={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders a label for each active filter', () => {
    renderWithRouter(<FilterListWithState init={['aws', 'gcp']} />);

    expect(screen.getByText('aws')).toBeInTheDocument();
    expect(screen.getByText('gcp')).toBeInTheDocument();
  });

  it('uses the labelMap to display readable names when provided', () => {
    const customLabels = {
      aws: 'Amazon Web Services',
      gcp: 'Google Cloud Platform',
    };

    renderWithRouter(
      <FilterListWithState init={['aws']} labelMap={customLabels} />,
    );

    expect(screen.getByText('Amazon Web Services')).toBeInTheDocument();
    expect(screen.queryByText('aws')).not.toBeInTheDocument();
  });

  it('renders stacked labels when multiple filters are active', () => {
    renderWithRouter(<FilterListWithState init={['aws', 'gcp', 'azure']} />);

    expect(screen.getByText('aws')).toBeInTheDocument();
    expect(screen.getByText('gcp')).toBeInTheDocument();
    expect(screen.getByText('azure')).toBeInTheDocument();
  });

  it('removes a filter when its label close button is clicked', () => {
    renderWithRouter(<FilterListWithState init={['aws', 'gcp']} />);

    expect(screen.getByText('aws')).toBeInTheDocument();
    expect(screen.getByText('gcp')).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[0]);

    expect(screen.queryByText('aws')).not.toBeInTheDocument();
    expect(screen.getByText('gcp')).toBeInTheDocument();
  });
});

describe('CloudProviderSharedFilterSelect integration', () => {
  it('allows the user to select multiple filters', () => {
    renderWithRouter(<FilterHarness />);

    fireEvent.click(
      screen.getByRole('button', { name: /filter by provider/i }),
    );
    fireEvent.click(screen.getByText('aws'));

    fireEvent.click(
      screen.getByRole('button', { name: /filter by provider/i }),
    );
    fireEvent.click(screen.getByText('gcp'));

    expect(screen.getByText('aws')).toBeInTheDocument();
    expect(screen.getByText('gcp')).toBeInTheDocument();
  });

  it('allows the user to deselect a previously selected filter', () => {
    renderWithRouter(<FilterHarness init={['aws']} />);

    expect(screen.getByText('aws')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /filter by provider/i }),
    );

    const awsOptions = screen.getAllByText('aws');
    fireEvent.click(awsOptions[awsOptions.length - 1]);

    expect(screen.getAllByText('aws')).toHaveLength(1);
  });

  it('shows readable labels in both the menu and selected filters when labelMap is provided', () => {
    const customLabels = {
      aws: 'Amazon Web Services',
      gcp: 'Google Cloud Platform',
      azure: 'Microsoft Azure',
    };

    renderWithRouter(<FilterHarness labelMap={customLabels} />);

    fireEvent.click(
      screen.getByRole('button', { name: /filter by provider/i }),
    );

    const awsOptions = screen.getAllByText('Amazon Web Services');
    fireEvent.click(awsOptions[awsOptions.length - 1]);

    expect(
      screen.getAllByText('Amazon Web Services').length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/^aws$/i)).not.toBeInTheDocument();
  });
});
