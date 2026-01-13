import React from 'react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { fireEvent, screen } from '@testing-library/react';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { CloudProviderFilterList } from '../CloudProviderFilterList';
import { cloudProviderFilterData } from '../../../state/goldImages';
import { CloudProviderName } from '../../../hooks/api/useGoldImages';

const CloudProviderFilterListWithState = ({
  init,
}: {
  init: CloudProviderName[];
}) => (
  <HydrateAtomsTestProvider initialValues={[[cloudProviderFilterData, init]]}>
    <CloudProviderFilterList />
  </HydrateAtomsTestProvider>
);

describe('Cloud provider filter list', () => {
  afterEach(() => {
    window.history.pushState(null, document.title, '/');
  });

  it('renderWithRouters when filters are set', () => {
    renderWithRouter(
      <CloudProviderFilterListWithState init={[CloudProviderName.AWS]} />,
    );

    expect(screen.queryByText('Cloud provider')).toBeInTheDocument();
    expect(screen.queryByText('AWS')).toBeInTheDocument();
  });

  it('only renderWithRouters selected filters', () => {
    renderWithRouter(
      <CloudProviderFilterListWithState
        init={[CloudProviderName.AWS, CloudProviderName.GCP]}
      />,
    );

    expect(screen.queryByText('AWS')).toBeInTheDocument();
    expect(screen.queryByText('Google Compute Engine')).toBeInTheDocument();
    expect(screen.queryByText('MicrosoftAzure')).not.toBeInTheDocument();
  });

  it('does not renderWithRouter when no filters are selected', () => {
    renderWithRouter(<CloudProviderFilterListWithState init={[]} />);

    expect(screen.queryByText('Cloud provider')).not.toBeInTheDocument();
  });

  it('removes filter when "x" is clicked', () => {
    const { container } = renderWithRouter(
      <CloudProviderFilterListWithState
        init={[CloudProviderName.AWS, CloudProviderName.GCP]}
      />,
    );

    expect(screen.queryByText('AWS')).toBeInTheDocument();
    expect(screen.queryByText('Google Compute Engine')).toBeInTheDocument();

    const closeButton = container.querySelector(
      '[aria-label="Close Google Compute Engine"]',
    );

    if (!closeButton) {
      throw new Error('Close button not found');
    }

    fireEvent.click(closeButton);

    expect(screen.queryByText('AWS')).toBeInTheDocument();
    expect(screen.queryByText('Google Cloud Engine')).not.toBeInTheDocument();
  });

  it('clears all filters when "Clear filters" is clicked', () => {
    renderWithRouter(
      <CloudProviderFilterListWithState
        init={[CloudProviderName.AWS, CloudProviderName.GCP]}
      />,
    );

    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Google Compute Engine')).toBeInTheDocument();

    const clearAllButton = screen.getByRole('button', {
      name: /clear filters/i,
    });

    fireEvent.click(clearAllButton);

    expect(screen.queryByText('AWS')).not.toBeInTheDocument();
    expect(screen.queryByText('Google Compute Engine')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /clear filters/i }),
    ).not.toBeInTheDocument();
  });
});
