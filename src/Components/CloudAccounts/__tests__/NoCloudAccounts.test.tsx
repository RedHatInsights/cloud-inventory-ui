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

  it('renders the documentation button', () => {
    render(<NoCloudAccounts />);

    const button = screen.getByRole('button', {
      name: /view documentation/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('View documentation');
  });
});
