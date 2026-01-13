import React from 'react';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { CloudProviderFilterSelect } from '../CloudProviderFilterSelect';
import { cloudProviderFilterData } from '../../../state/goldImages';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';

const CloudProviderFilterSelectWithState = ({ init }: { init: string[] }) => (
  <HydrateAtomsTestProvider initialValues={[[cloudProviderFilterData, init]]}>
    <CloudProviderFilterSelect
      cloudProviders={['AWS', 'Google Cloud Engine', 'Microsoft Azure']}
    />
  </HydrateAtomsTestProvider>
);

describe('Cloud provider filter select', () => {
  it('renders', () => {
    renderWithRouter(<CloudProviderFilterSelectWithState init={[]} />);

    expect(screen.queryByText('Filter by cloud provider')).toBeInTheDocument();
  });

  it('renders the options', async () => {
    const { queryByText } = renderWithRouter(
      <CloudProviderFilterSelectWithState init={[]} />,
    );

    expect(screen.queryByText('AWS')).not.toBeInTheDocument();
    expect(screen.queryByText('Google Cloud Engine')).not.toBeInTheDocument();
    expect(screen.queryByText('Microsoft Azure')).not.toBeInTheDocument();

    const expandButton = queryByText('Filter by cloud provider')?.parentElement;

    if (!expandButton) {
      throw new Error('expand button missing');
    }

    fireEvent.click(expandButton);

    await waitFor(() => expect(screen.queryByText('AWS')).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.queryByText('Google Cloud Engine')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.queryByText('Microsoft Azure')).toBeInTheDocument(),
    );
  });

  it('can select an option', async () => {
    const { queryByText } = renderWithRouter(
      <CloudProviderFilterSelectWithState init={[]} />,
    );

    const expandButton = queryByText('Filter by cloud provider')?.parentElement;

    if (!expandButton) {
      throw new Error('expand button missing');
    }

    fireEvent.click(expandButton);

    await waitFor(() =>
      expect(screen.queryByText('AWS')?.nextSibling).not.toBeInTheDocument(),
    );

    const selectAwsButton = queryByText('AWS')?.parentElement?.parentElement;

    if (!selectAwsButton) {
      throw new Error('AWS button not found');
    }

    fireEvent.click(selectAwsButton);
    fireEvent.click(expandButton);

    await waitFor(() =>
      expect(screen.queryByText('AWS')?.nextSibling).toHaveClass(
        'pf-v6-c-menu__item-select-icon',
      ),
    );
  });

  it('can expand with label', async () => {
    const { queryByText } = renderWithRouter(
      <CloudProviderFilterSelectWithState init={[]} />,
    );

    const expandButton = queryByText('Cloud Provider');

    if (!expandButton) {
      throw new Error('expand label missing');
    }

    fireEvent.click(expandButton);

    await waitFor(() => expect(screen.queryByText('AWS')).toBeInTheDocument());

    fireEvent.click(expandButton);

    await waitFor(() =>
      expect(screen.queryByText('AWS')).not.toBeInTheDocument(),
    );
  });

  it('closes when clicked outside of', async () => {
    const { container, queryByText } = renderWithRouter(
      <CloudProviderFilterSelectWithState init={[]} />,
    );

    const expandButton = queryByText('Filter by cloud provider')?.parentElement;

    if (!expandButton) {
      throw new Error('expand button missing');
    }

    fireEvent.click(expandButton);

    await waitFor(() => expect(screen.queryByText('AWS')).toBeInTheDocument());

    const clickOutside = container.getRootNode();

    fireEvent.click(clickOutside);

    await waitFor(() =>
      expect(screen.queryByText('AWS')).not.toBeInTheDocument(),
    );
  });
});
