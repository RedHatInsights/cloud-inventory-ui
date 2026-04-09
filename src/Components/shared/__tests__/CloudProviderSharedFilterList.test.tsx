import React from 'react';
import { screen } from '@testing-library/react';
import { atom } from 'jotai';
import { CloudProviderSharedFilterList } from '../CloudProviderSharedFilterList';
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

describe('CloudProviderSharedFilterList', () => {
  it('returns null when no filters are present', () => {
    const { container } = renderWithRouter(<FilterListWithState init={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders a Label for each active filter', () => {
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
});
