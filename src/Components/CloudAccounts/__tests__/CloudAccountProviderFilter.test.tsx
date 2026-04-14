import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useAtomValue } from 'jotai';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { CloudAccountProviderFilter } from '../CloudAccountProviderFilter';
import { cloudProviderFilterData } from '../../../state/cloudAccounts';
import { CloudProviderShortname } from '../../../types/cloudAccountsTypes';

const availableProviders = [
  CloudProviderShortname.AWS,
  CloudProviderShortname.GCP,
  CloudProviderShortname.AZURE,
];

const CloudAccountProviderFilterWithState = ({
  init = [],
}: {
  init?: CloudProviderShortname[];
}) => (
  <HydrateAtomsTestProvider initialValues={[[cloudProviderFilterData, init]]}>
    <CloudAccountProviderFilter availableProviders={availableProviders} />
  </HydrateAtomsTestProvider>
);

const CloudAccountProviderFilterWithStateObserver = ({
  init = [],
}: {
  init?: CloudProviderShortname[];
}) => {
  const StateObserver = () => {
    const selectedProviders = useAtomValue(cloudProviderFilterData);

    return (
      <div data-testid="selected-providers">
                {JSON.stringify(selectedProviders)}
              
      </div>
    );
  };

  return (
    <HydrateAtomsTestProvider initialValues={[[cloudProviderFilterData, init]]}>
      <CloudAccountProviderFilter availableProviders={availableProviders} />
      <StateObserver />
    </HydrateAtomsTestProvider>
  );
};

beforeEach(() => {
  window.history.pushState({}, '', '/');
});

describe('CloudAccountProviderFilter', () => {
  it('renders the provider filter toggle', () => {
    renderWithRouter(<CloudAccountProviderFilterWithState />);

    expect(
      screen.getByRole('button', { name: /filter by cloud provider/i }),
    ).toBeInTheDocument();
  });

  it('renders available provider options when opened', async () => {
    renderWithRouter(<CloudAccountProviderFilterWithState />);

    fireEvent.click(
      screen.getByRole('button', { name: /filter by cloud provider/i }),
    );

    await waitFor(() => {
      expect(screen.getByText('AWS')).toBeInTheDocument();
      expect(screen.getByText('Google Compute Engine')).toBeInTheDocument();
      expect(screen.getByText('Microsoft Azure')).toBeInTheDocument();
    });
  });

  it('selects a provider', async () => {
    renderWithRouter(<CloudAccountProviderFilterWithStateObserver />);

    fireEvent.click(
      screen.getByRole('button', { name: /filter by cloud provider/i }),
    );

    await waitFor(() => {
      expect(screen.getByText('AWS')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('AWS'));

    await waitFor(() => {
      expect(screen.getByTestId('selected-providers')).toHaveTextContent(
        '["AWS"]',
      );
    });
  });

  it('supports selecting multiple providers', async () => {
    renderWithRouter(<CloudAccountProviderFilterWithStateObserver />);

    fireEvent.click(
      screen.getByRole('button', { name: /filter by cloud provider/i }),
    );

    await waitFor(() => {
      expect(screen.getByText('AWS')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('AWS'));
    fireEvent.click(screen.getByText('Google Compute Engine'));

    await waitFor(() => {
      expect(screen.getByTestId('selected-providers')).toHaveTextContent(
        '["AWS","GCE"]',
      );
    });
  });

  it('removes a selected provider when selected again', async () => {
    renderWithRouter(
      <CloudAccountProviderFilterWithStateObserver
        init={[CloudProviderShortname.AWS]}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /filter by cloud provider/i }),
    );

    await waitFor(() => {
      expect(screen.getByText('AWS')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('AWS'));

    await waitFor(() => {
      expect(screen.getByTestId('selected-providers')).toHaveTextContent('[]');
    });
  });

  it('preserves existing selections and adds another provider', async () => {
    renderWithRouter(
      <CloudAccountProviderFilterWithStateObserver
        init={[CloudProviderShortname.AWS]}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: /filter by cloud provider/i }),
    );

    await waitFor(() => {
      expect(screen.getByText('Google Compute Engine')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Google Compute Engine'));

    await waitFor(() => {
      expect(screen.getByTestId('selected-providers')).toHaveTextContent(
        '["AWS","GCE"]',
      );
    });
  });

  it('shows provider display labels instead of raw shortnames in the menu', async () => {
    renderWithRouter(<CloudAccountProviderFilterWithState />);

    fireEvent.click(
      screen.getByRole('button', { name: /filter by cloud provider/i }),
    );

    await waitFor(() => {
      expect(screen.getByText('Google Compute Engine')).toBeInTheDocument();
      expect(screen.getByText('Microsoft Azure')).toBeInTheDocument();
    });

    expect(screen.queryByText('GCE')).not.toBeInTheDocument();
    expect(screen.queryByText('MSAZ')).not.toBeInTheDocument();
  });
});
