import React from 'react';
import NoPermissionsPage from '../NoPermissionsPage';
import { render, screen } from '@testing-library/react';

it('Renders no permissions page', () => {
  render(<NoPermissionsPage />);
  expect(
    screen.getByText('You do not have access to Cloud Inventory')
  ).toBeInTheDocument();
});
