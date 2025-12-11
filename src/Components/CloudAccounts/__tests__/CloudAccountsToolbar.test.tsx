import React from 'react';
import { CloudAccountsToolbar } from '../CloudAccountsToolbar';
import { renderWithRouter } from '../../../utils/testing/customRender';

describe('CloudAccountsToolbar', () => {
  it('renders the toolbar container', () => {
    const { container } = renderWithRouter(<CloudAccountsToolbar />);

    expect(
      container.querySelector('[data-ouia-component-type="PF6/Toolbar"]')
    ).not.toBeNull();
  });

  it('renders the CloudAccountsPagination component', () => {
    const { container } = renderWithRouter(<CloudAccountsToolbar />);

    expect(
      container.querySelector('[data-ouia-component-type="PF6/Pagination"]')
    ).not.toBeNull();
  });
});
