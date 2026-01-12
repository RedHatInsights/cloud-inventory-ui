import React from 'react';
import { render, screen } from '@testing-library/react';
import { NoCloudAccounts } from '../NoCloudAccounts';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@patternfly/react-icons/dist/esm/icons/cubes-icon', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-cubes-icon" />,
}));
describe('NoCloudAccounts', () => {
  const renderWithRouter = () =>
    render(
      <MemoryRouter>
        <NoCloudAccounts />
      </MemoryRouter>
    );

  it('renders the empty state title', () => {
    renderWithRouter();

    expect(screen.getByText('Cloud Accounts Available')).toBeInTheDocument();
  });

  it('renders the documentation button', () => {
    renderWithRouter();

    const button = screen.getByRole('button', {
      name: /view documentation/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('View documentation');
  });

  it('renders integrations link', () => {
    renderWithRouter();

    const link = screen.getByRole('link', {
      name: /integrations/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/settings/integrations/');
  });
});
