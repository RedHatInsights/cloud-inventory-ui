import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { CloudAccountsTable } from '../CloudAccountsTable';
describe('Cloud accounts table', () => {
  it('renders the table', () => {
    const { container, getByLabelText } = renderWithRouter(
      <CloudAccountsTable />
    );
    expect(getByLabelText('Cloud accounts table')).toBeInTheDocument();
    expect(container.querySelector('table')).toBeInTheDocument();
  });
  it('renders the correct number of rows', () => {
    const { container } = renderWithRouter(<CloudAccountsTable />);
    const rows = container.querySelector('tbody')?.childNodes;
    expect(rows?.length).toBe(3);
  });
  it('sorts by clicking the Cloud account column header', async () => {
    const { container } = renderWithRouter(<CloudAccountsTable />);
    const sortButton =
      container.querySelector('thead button') ||
      container.querySelector('th button');
    if (!sortButton) throw new Error('Sort button not found');
    const initial = Array.from(container.querySelectorAll('tbody tr')).map(
      (r) => r.firstChild?.textContent
    );
    fireEvent.click(sortButton);
    const descending = [...initial].sort().reverse();
    await waitFor(() => {
      const firstCell =
        container.querySelector('tbody')?.firstChild?.firstChild?.textContent;
      expect(firstCell).toBe(descending[0]);
    });
    fireEvent.click(sortButton);
    const ascending = [...initial].sort();
    await waitFor(() => {
      const firstCell =
        container.querySelector('tbody')?.firstChild?.firstChild?.textContent;
      expect(firstCell).toBe(ascending[0]);
    });
  });
  it('renders provider links correctly', () => {
    const { getByText } = renderWithRouter(<CloudAccountsTable />);
    const awsLink = getByText('AWS').closest('a');
    const azureLink = getByText('Azure').closest('a');
    const gcpLink = getByText('Google Cloud').closest('a');
    expect(awsLink?.getAttribute('href')).toBe('/gold-images?provider=aws');
    expect(azureLink?.getAttribute('href')).toBe('/gold-images?provider=azure');
    expect(gcpLink?.getAttribute('href')).toBe('/gold-images?provider=google');
  });
  it('renders gold image access icons + labels', () => {
    const { getByText } = renderWithRouter(<CloudAccountsTable />);
    expect(getByText('Granted')).toBeInTheDocument();
    expect(getByText('Failed')).toBeInTheDocument();
    expect(getByText('Requested')).toBeInTheDocument();
  });
});
