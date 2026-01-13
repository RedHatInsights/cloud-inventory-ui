import React from 'react';
import OopsPage from '../OopsPage';
import { render, screen } from '@testing-library/react';

it('Renders no permissions page', () => {
  render(<OopsPage />);
  expect(
    screen.getByText('This page is temporarily unavailable'),
  ).toBeInTheDocument();
});
