import { CloudProviderName } from '../../../hooks/api/useGoldImages';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { GoldImagesToolbar } from '../GoldImagesToolbar';
import React from 'react';

describe('Gold images toolbar', () => {
  it('renders', () => {
    const { container } = renderWithRouter(
      <GoldImagesToolbar
        goldImages={{
          aws: { provider: CloudProviderName.AWS, goldImages: [] },
        }}
      />
    );

    expect(
      container.querySelector('[data-ouia-component-type="PF6/Toolbar"]'),
    ).not.toBeNull();
  });
});
