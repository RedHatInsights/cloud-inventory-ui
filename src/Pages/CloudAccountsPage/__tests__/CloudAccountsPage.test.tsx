import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CloudInventoryPage from '../../../Pages/CloudAccountsPage/CloudAccountsPage';
jest.mock('../../../Components/CloudAccounts/CloudAccountsTable', () => ({
  CloudAccountsTable: () => <div data-testid="cloud-accounts-table" />,
}));
jest.mock('../../../Components/CloudAccounts/CloudAccountsToolbar', () => ({
  CloudAccountsToolbar: () => <div data-testid="cloud-accounts-toolbar" />,
}));
jest.mock('../../../Components/CloudAccounts/CloudAccountsPagination', () => ({
  CloudAccountsPagination: () => (
    <div data-testid="cloud-accounts-pagination" />
  ),
}));
describe('CloudInventoryPage', () => {
  const setup = () =>
    render(
      <BrowserRouter>
        <CloudInventoryPage />
      </BrowserRouter>
    );
  test('renders the page header', () => {
    setup();
    expect(
      screen.getByRole('heading', { name: 'Cloud Inventory' })
    ).toBeInTheDocument();
  });
  test('renders the CloudAccountsToolbar', () => {
    setup();
    expect(screen.getByTestId('cloud-accounts-toolbar')).toBeInTheDocument();
  });
  test('renders the CloudAccountsTable', () => {
    setup();
    expect(screen.getByTestId('cloud-accounts-table')).toBeInTheDocument();
  });
  test('renders the CloudAccountsPagination', () => {
    setup();
    expect(screen.getByTestId('cloud-accounts-pagination')).toBeInTheDocument();
  });
});
