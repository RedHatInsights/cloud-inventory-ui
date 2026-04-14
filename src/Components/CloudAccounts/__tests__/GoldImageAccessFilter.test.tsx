import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useAtomValue } from 'jotai';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { GoldImageAccessFilter } from '../GoldImageAccessFilter';
import { goldImageStatusFilterData } from '../../../state/cloudAccounts';

const availableStatuses = ['available', 'pending', 'disabled'];

const GoldImageAccessFilterWithState = ({ init = [] }: { init?: string[] }) => (
  <HydrateAtomsTestProvider initialValues={[[goldImageStatusFilterData, init]]}>
        
    <GoldImageAccessFilter availableStatuses={availableStatuses} />
      
  </HydrateAtomsTestProvider>
);

const GoldImageAccessFilterWithStateObserver = ({
  init = [],
}: {
  init?: string[];
}) => {
  const StateObserver = () => {
    const selectedStatuses = useAtomValue(goldImageStatusFilterData);

    return (
      <div data-testid="selected-statuses">
                {JSON.stringify(selectedStatuses)}
              
      </div>
    );
  };

  return (
    <HydrateAtomsTestProvider
      initialValues={[[goldImageStatusFilterData, init]]}
    >
            
      <GoldImageAccessFilter availableStatuses={availableStatuses} />
            
      <StateObserver />
          
    </HydrateAtomsTestProvider>
  );
};

describe('GoldImageAccessFilter', () => {
  it('renders default label when no statuses are selected', () => {
    renderWithRouter(<GoldImageAccessFilterWithState />);

    expect(
      screen.getByRole('button', { name: 'Filter by status' }),
    ).toBeInTheDocument();
  });

  it('renders available status options when opened', async () => {
    renderWithRouter(<GoldImageAccessFilterWithState />);

    fireEvent.click(screen.getByRole('button', { name: 'Filter by status' }));

    await waitFor(() => {
      expect(screen.getByText('available')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
      expect(screen.getByText('disabled')).toBeInTheDocument();
    });
  });

  it('selects a status', async () => {
    renderWithRouter(<GoldImageAccessFilterWithStateObserver />);

    fireEvent.click(screen.getByRole('button', { name: 'Filter by status' }));

    await waitFor(() => {
      expect(screen.getByText('available')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('available'));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Status' }),
      ).toBeInTheDocument();
      expect(screen.getByTestId('selected-statuses')).toHaveTextContent(
        '["available"]',
      );
    });
  });

  it('does not remove a selected status when it is selected again from the menu', async () => {
    renderWithRouter(
      <GoldImageAccessFilterWithStateObserver init={['available']} />,
    );

    expect(screen.getByRole('button', { name: 'Status' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Status' }));

    await waitFor(() => {
      expect(screen.getByText('available')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('available'));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Status' }),
      ).toBeInTheDocument();
      expect(screen.getByTestId('selected-statuses')).toHaveTextContent(
        '["available"]',
      );
    });
  });

  it('supports multiple selected statuses by reopening the menu', async () => {
    renderWithRouter(<GoldImageAccessFilterWithStateObserver />);

    fireEvent.click(
      screen.getByRole('button', { name: /filter by status|status/i }),
    );

    await waitFor(() => {
      expect(screen.getByText('available')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('available'));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Status' }),
      ).toBeInTheDocument();
      expect(screen.getByTestId('selected-statuses')).toHaveTextContent(
        '["available"]',
      );
    });

    fireEvent.click(screen.getByRole('button', { name: 'Status' }));

    await waitFor(() => {
      expect(screen.getByText('pending')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('pending'));

    await waitFor(() => {
      expect(screen.getByTestId('selected-statuses')).toHaveTextContent(
        '["available","pending"]',
      );
      expect(
        screen.getByRole('button', { name: 'Status' }),
      ).toBeInTheDocument();
    });
  });

  it('shows Status label when initialized with selected statuses', () => {
    renderWithRouter(
      <GoldImageAccessFilterWithState init={['available', 'pending']} />,
    );

    expect(screen.getByRole('button', { name: 'Status' })).toBeInTheDocument();
  });

  it('closes the menu after selecting a status', async () => {
    renderWithRouter(<GoldImageAccessFilterWithStateObserver />);

    fireEvent.click(
      screen.getByRole('button', { name: /filter by status|status/i }),
    );

    await waitFor(() => {
      expect(screen.getByText('available')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('available'));

    await waitFor(() => {
      expect(screen.queryByText('pending')).not.toBeInTheDocument();
    });
  });
});
