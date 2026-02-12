import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithRouter } from '../../../utils/testing/customRender';
import {
  CloudProviderName,
  GoldImagesResponse,
} from '../../../hooks/api/useGoldImages';
import { GoldImagesTable } from '../GoldImagesTable';
import { HydrateAtomsTestProvider } from '../../util/testing/HydrateAtomsTestProvider';
import {
  cloudProviderFilterData,
  goldImagePaginationData,
} from '../../../state/goldImages';

const goldImageTestData: (amount: number) => GoldImagesResponse = (
  amount: number,
) => {
  const providers = [
    CloudProviderName.AWS,
    CloudProviderName.GCP,
    CloudProviderName.AZURE,
  ];

  const data: GoldImagesResponse = {};

  for (let i = 0; i < amount; i++) {
    const provider = providers[i % providers.length];
    data[`${provider}-${i}`] = {
      provider,
      goldImages: [
        {
          name: `Test ${i}`,
          description: `Test description ${i}`,
        },
      ],
    };
  }

  return data;
};

describe('Gold images table', () => {
  it('renders', () => {
    const { container } = renderWithRouter(
      <GoldImagesTable goldImages={goldImageTestData(3)} />,
    );

    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('sorts', async () => {
    const goldImageData = goldImageTestData(3);
    const sortedGoldImageData = Object.values(goldImageData).sort((a, b) =>
      a.provider.localeCompare(b.provider),
    );

    const { container } = renderWithRouter(
      <GoldImagesTable goldImages={goldImageData} />,
    );

    const sortButton = container.querySelector('button');

    if (!sortButton) {
      throw new Error('Sort button not found');
    }

    fireEvent.click(sortButton);

    await waitFor(() =>
      expect(
        container.querySelector('tbody')?.firstChild?.firstChild?.firstChild
          ?.textContent,
      ).toBe(sortedGoldImageData[sortedGoldImageData.length - 1].provider),
    );

    fireEvent.click(sortButton);

    await waitFor(() =>
      expect(
        container.querySelector('tbody')?.firstChild?.firstChild?.firstChild
          ?.textContent,
      ).toBe(sortedGoldImageData[0].provider),
    );
  });

  it('applies pagination', () => {
    const { container } = renderWithRouter(
      <GoldImagesTable goldImages={goldImageTestData(12)} />,
    );

    expect(container.querySelector('tbody')?.childNodes.length).toBe(10);
  });

  it('applies filters', () => {
    const goldImageData = goldImageTestData(3);

    const { container } = renderWithRouter(
      <HydrateAtomsTestProvider
        initialValues={[
          [cloudProviderFilterData, [Object.values(goldImageData)[0].provider]],
        ]}
      >
        <GoldImagesTable goldImages={goldImageData} />
      </HydrateAtomsTestProvider>,
    );

    expect(container.querySelector('tbody')?.childNodes.length).toBe(1);
    expect(
      container.querySelector('tbody')?.firstChild?.firstChild?.firstChild
        ?.textContent,
    ).toBe(Object.values(goldImageData)[0].provider);
  });

  it('does not render pagination error when on valid page', () => {
    const { container } = renderWithRouter(
      <GoldImagesTable goldImages={goldImageTestData(25)} />,
    );

    expect(
      container.querySelector('table')?.textContent,
    ).not.toMatch(/No results for current page/i);
  });

  it('renders pagination error when page exceeds item count', () => {
    const goldImageData = goldImageTestData(5);

    const { container } = renderWithRouter(
      <HydrateAtomsTestProvider
        initialValues={[
          [goldImagePaginationData, { page: 10, perPage: 10, itemCount: 5 }],
        ]}
      >
        <GoldImagesTable goldImages={goldImageData} />
      </HydrateAtomsTestProvider>,
    );

    expect(container.textContent).toMatch(/No results for current page/i);
    expect(container.textContent).toMatch(/Return to page 1/i);
  });

  it('does not render table content when pagination error is shown', () => {
    const goldImageData = goldImageTestData(5);

    const { container } = renderWithRouter(
      <HydrateAtomsTestProvider
        initialValues={[
          [goldImagePaginationData, { page: 10, perPage: 10, itemCount: 5 }],
        ]}
      >
        <GoldImagesTable goldImages={goldImageData} />
      </HydrateAtomsTestProvider>,
    );

    expect(container.querySelector('thead')).not.toBeInTheDocument();
    expect(container.querySelector('tbody')).not.toBeInTheDocument();
  });
});
