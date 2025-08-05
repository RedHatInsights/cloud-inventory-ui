import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { GoldImagesResponse } from '../../../hooks/api/useGoldImages';
import { GoldImagesTable } from '../GoldImagesTable';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import { cloudProviderFilterData } from '../../../state/goldImages';

const goldImageTestData: (amount: number) => GoldImagesResponse = (
  amount: number
) => {
  const data: GoldImagesResponse = {};

  for (let i = 0; i < amount; i++) {
    const k = (Math.random() + 1).toString(36).substring(7);
    data[k] = {
      provider: k,
      goldImages: [
        {
          name: `Test ${k}`,
          description: `Test description ${k}`,
        },
      ],
    };
  }

  return data;
};

describe('Gold images table', () => {
  it('renders', () => {
    const { container } = render(
      <GoldImagesTable goldImages={goldImageTestData(3)} />
    );

    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('sorts', async () => {
    const goldImageData = goldImageTestData(3);
    const sortedGoldImageData = Object.values(goldImageData).sort((a, b) =>
      a.provider.localeCompare(b.provider)
    );

    const { container } = render(
      <GoldImagesTable goldImages={goldImageData} />
    );

    const sortButton = container.querySelector('button');

    if (!sortButton) {
      throw new Error('Sort button not found');
    }

    // sort
    fireEvent.click(sortButton);

    await waitFor(() =>
      expect(
        container.querySelector('tbody')?.firstChild?.firstChild?.firstChild
          ?.textContent
      ).toBe(sortedGoldImageData[sortedGoldImageData.length - 1].provider)
    );

    // sort the other direction
    fireEvent.click(sortButton);

    await waitFor(() =>
      expect(
        container.querySelector('tbody')?.firstChild?.firstChild?.firstChild
          ?.textContent
      ).toBe(sortedGoldImageData[0].provider)
    );
  });

  it('applies pagination', () => {
    const { container } = render(
      <GoldImagesTable goldImages={goldImageTestData(12)} />
    );

    // 10 is default pagination size
    expect(container.querySelector('tbody')?.childNodes.length).toBe(10);
  });

  it('applies filters', () => {
    const goldImageData = goldImageTestData(3);

    const { container } = render(
      <HydrateAtomsTestProvider
        initialValues={[
          [cloudProviderFilterData, [Object.values(goldImageData)[0].provider]],
        ]}
      >
        <GoldImagesTable goldImages={goldImageData} />
      </HydrateAtomsTestProvider>
    );

    expect(container.querySelector('tbody')?.childNodes.length).toBe(1);
    expect(
      container.querySelector('tbody')?.firstChild?.firstChild?.firstChild
        ?.textContent
    ).toBe(Object.values(goldImageData)[0].provider);
  });
});
