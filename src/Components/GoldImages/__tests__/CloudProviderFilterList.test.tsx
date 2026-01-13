import React from 'react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { fireEvent, screen } from '@testing-library/react';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { CloudProviderFilterList } from '../CloudProviderFilterList';
import { cloudProviderFilterData } from '../../../state/goldImages';

const CloudProviderFilterListWithState = ({ init }: { init: string[] }) => (
  <HydrateAtomsTestProvider initialValues={[[cloudProviderFilterData, init]]}>
    <CloudProviderFilterList />
  </HydrateAtomsTestProvider>
);

describe('Cloud provider filter list', () => {
  afterEach(() => {
    window.history.pushState(null, document.title, '/');
  });

  it('renderWithRouters when filters are set', () => {
    renderWithRouter(<CloudProviderFilterListWithState init={['AWS']} />);

    expect(screen.queryByText('Cloud provider')).toBeInTheDocument();
    expect(screen.queryByText('AWS')).toBeInTheDocument();
  });

  it('only renderWithRouters selected filters', () => {
    renderWithRouter(
      <CloudProviderFilterListWithState
        init={['AWS', 'Google Cloud Engine']}
      />,
    );

    expect(screen.queryByText('AWS')).toBeInTheDocument();
    expect(screen.queryByText('Google Cloud Engine')).toBeInTheDocument();
    expect(screen.queryByText('MicrosoftAzure')).not.toBeInTheDocument();
  });

  it('does not renderWithRouter when no filters are selected', () => {
    renderWithRouter(<CloudProviderFilterListWithState init={[]} />);

    expect(screen.queryByText('Cloud provider')).not.toBeInTheDocument();
  });

  it('removes filter when "x" is clicked', () => {
    const { container } = renderWithRouter(
      <CloudProviderFilterListWithState
        init={['AWS', 'Google Cloud Engine']}
      />,
    );

    expect(screen.queryByText('AWS')).toBeInTheDocument();
    expect(screen.queryByText('Google Cloud Engine')).toBeInTheDocument();

    const closeButton = container.querySelector(
      '[aria-label="Close Google Cloud Engine"]',
    );

    if (!closeButton) {
      throw new Error('Close button not found');
    }

    fireEvent.click(closeButton);

    expect(screen.queryByText('AWS')).toBeInTheDocument();
    expect(screen.queryByText('Google Cloud Engine')).not.toBeInTheDocument();
  });

  it('clears all filters when "clear filters" is clicked', () => {
    const { container } = renderWithRouter(
      <CloudProviderFilterListWithState
        init={['AWS', 'Google Cloud Engine']}
      />,
    );

    expect(screen.queryByText('Cloud provider')).toBeInTheDocument();
    expect(screen.queryByText('AWS')).toBeInTheDocument();
    expect(screen.queryByText('Google Cloud Engine')).toBeInTheDocument();

    const clearAllButton = container.querySelector('.pf-v6-c-button.pf-m-link');

    if (!clearAllButton) {
      throw new Error('Clear all button not found');
    }

    fireEvent.click(clearAllButton);

    expect(screen.queryByText('Cloud provider')).not.toBeInTheDocument();
    expect(screen.queryByText('AWS')).not.toBeInTheDocument();
    expect(screen.queryByText('Google Cloud Engine')).not.toBeInTheDocument();
  });
});
