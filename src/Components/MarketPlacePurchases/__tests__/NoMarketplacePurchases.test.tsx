import React from 'react';
import { render, screen } from '@testing-library/react';
import { NoMarketplacePurchases } from '../NoMarketplacePurchases';

jest.mock('@patternfly/react-icons', () => ({
  CubesIcon: () => <div data-testid="mock-cubes-icon" />
}));

describe('NoMarketplacePurchases', () => {
  it('renders the empty state title', () => {
    render(<NoMarketplacePurchases />);

    expect(
      screen.getByRole('heading', {
        level: 4
      })
    ).toHaveTextContent('No Marketplace Purchases Available');
  });

  it('renders the empty state body', () => {
    render(<NoMarketplacePurchases />);

    expect(screen.getByText(/you have no marketplace purchases/i)).toBeInTheDocument();
  });

  it('renders the cubes icon', () => {
    render(<NoMarketplacePurchases />);

    expect(screen.getByTestId('mock-cubes-icon')).toBeInTheDocument();
  });
});
