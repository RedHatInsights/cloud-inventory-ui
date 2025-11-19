import { render, screen } from '@testing-library/react';
import React from 'react';
import { NoCloudAccounts } from '../NoCloudAccounts';

describe('No cloud accounts', () => {
  it('renders', () => {
    render(<NoCloudAccounts />);

    expect(screen.queryByText('No cloud accounts')).toBeInTheDocument();
  });
});
