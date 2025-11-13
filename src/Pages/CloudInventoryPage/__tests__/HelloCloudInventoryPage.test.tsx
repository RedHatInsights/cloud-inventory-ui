import React from 'react';
import { render, screen } from '@testing-library/react';
import HelloCloudInventory from '../CloudInventoryPage';

it('Renders hello page', () => {
  render(<HelloCloudInventory />);
  expect(screen.getByText('Hello, Cloud Inventory')).toBeInTheDocument();
});
