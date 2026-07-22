import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import MarketplacePurchasesPage from '../MarketplacePurchasesPage';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { ManipulatableQueryWrapper } from '../../../Components/util/testing/ManipulatableQueryWrapper';

const defaultQueryParams = {
  limit: 10,
  offset: 0,
};

const mockMarketplacePurchasesResponse = {
  pagination: {
    offset: 0,
    limit: 10,
    count: 2,
    total: 2,
  },
  body: [
    {
      offeringName:
        'Red Hat OpenShift Streams for Apache Kafka - Testing Purposes Only',
      marketplaceAccount: '665427542893',
      marketplace: 'aws_marketplace',
      startDate: '2025-05-22T18:39:23.826220243Z',
      skus: ['MW01882'],
    },
    {
      offeringName: 'Red Hat Enterprise Linux',
      marketplaceAccount: '252b3da5-a55b-4baf-aad0-186a8f3e6fcb',
      marketplace: 'azure_marketplace',
      startDate: '2026-07-13T00:00:00Z',
      skus: ['RH02612'],
    },
  ],
};

const { ComponentWithQueryClient, queryClient } = ManipulatableQueryWrapper(
  <MarketplacePurchasesPage />,
);

describe('Marketplace purchases page', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('renders the Marketplace Purchases page', async () => {
    queryClient.setQueryData(
      ['marketplacePurchases', defaultQueryParams],
      mockMarketplacePurchasesResponse,
    );

    renderWithRouter(<ComponentWithQueryClient />);

    expect(
      await screen.findByRole('heading', {
        name: /marketplace purchases/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('grid', {
        name: /marketplace purchases table/i,
      }),
    ).toBeInTheDocument();
  });

  it('renders marketplace purchase data', async () => {
    queryClient.setQueryData(
      ['marketplacePurchases', defaultQueryParams],
      mockMarketplacePurchasesResponse,
    );

    renderWithRouter(<ComponentWithQueryClient />);

    expect(
      await screen.findByText(
        'Red Hat OpenShift Streams for Apache Kafka - Testing Purposes Only',
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Red Hat Enterprise Linux')).toBeInTheDocument();
    expect(screen.getByText('665427542893')).toBeInTheDocument();

    expect(
      screen.getByText('252b3da5-a55b-4baf-aad0-186a8f3e6fcb'),
    ).toBeInTheDocument();

    expect(screen.getByText('aws_marketplace')).toBeInTheDocument();
    expect(screen.getByText('azure_marketplace')).toBeInTheDocument();
  });

  it('renders one row for each marketplace purchase', async () => {
    queryClient.setQueryData(
      ['marketplacePurchases', defaultQueryParams],
      mockMarketplacePurchasesResponse,
    );

    renderWithRouter(<ComponentWithQueryClient />);

    await screen.findByText('Red Hat Enterprise Linux'); // One header row plus two purchase rows.

    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('shows the empty state when no marketplace purchases exist', async () => {
    queryClient.setQueryData(['marketplacePurchases', defaultQueryParams], {
      pagination: {
        offset: 0,
        limit: 10,
        count: 0,
        total: 0,
      },
      body: [],
    });

    renderWithRouter(<ComponentWithQueryClient />);

    expect(
      await screen.findByRole('heading', {
        name: /no marketplace purchases/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/you have no marketplace purchases/i),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('grid', {
        name: /marketplace purchases table/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('opens the Marketplace Purchases information popover', async () => {
    queryClient.setQueryData(
      ['marketplacePurchases', defaultQueryParams],
      mockMarketplacePurchasesResponse,
    );

    renderWithRouter(<ComponentWithQueryClient />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /more information about marketplace purchases/i,
      }),
    );

    expect(
      await screen.findByText(
        /marketplace purchases shows purchases made from AWS, Azure, Google Cloud, Red Hat Marketplace, and IBM Cloud Paks/i,
      ),
    ).toBeInTheDocument();
  });
});
