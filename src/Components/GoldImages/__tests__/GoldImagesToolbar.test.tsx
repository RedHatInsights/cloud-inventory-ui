import { renderWithRouter } from '../../../utils/testing/customRender';
import { GoldImagesToolbar } from '../GoldImagesToolbar';
import React from 'react';

describe('Gold images toolbar', () => {
  it('renders', () => {
    const { container } = renderWithRouter(
      <GoldImagesToolbar
        goldImages={{ test: { provider: 'test', goldImages: [] } }}
      />,
    );

    expect(
      container.querySelector('[data-ouia-component-type="PF6/Toolbar"]'),
    ).not.toBeNull();
  });
});
