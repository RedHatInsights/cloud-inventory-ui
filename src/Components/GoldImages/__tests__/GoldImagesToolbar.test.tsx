import { render } from '@testing-library/react';
import { GoldImagesToolbar } from '../GoldImagesToolbar';
import React from 'react';

describe('Gold images toolbar', () => {
  it('renders', () => {
    const { container } = render(
      <GoldImagesToolbar
        goldImages={{ test: { provider: 'test', goldImages: [] } }}
      />
    );

    expect(
      container.querySelector('[data-ouia-component-type="PF6/Toolbar"]')
    ).not.toBeNull();
  });
});
