import React from 'react';
import { render, screen } from '@testing-library/react';
import { NoCloudAccounts } from '../NoCloudAccounts';

jest.mock('@patternfly/react-icons/dist/esm/icons/cubes-icon', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-cubes-icon" />,
}));
describe('NoCloudAccounts', () => {
  it('renders the empty state title', () => {
    render(<NoCloudAccounts />);

    expect(screen.getByText('Cloud Accounts Available')).toBeInTheDocument();
  });

  it('renders the empty state body text', () => {
    render(<NoCloudAccounts />);

    expect(
      screen.getByText(
        /Cloud accounts appear when they are connected through integrations/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /accounts will show up here if auto-registration or gold image access is initiated/i
      )
    ).toBeInTheDocument();
  });

  it('renders the documentation button', () => {
    render(<NoCloudAccounts />);

    const button = screen.getByRole('button', {
      name: /view documentation/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('View documentation');
  });
});
