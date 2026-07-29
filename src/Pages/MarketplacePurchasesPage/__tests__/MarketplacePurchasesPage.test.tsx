import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import MarketplacePurchasesPage from '../MarketplacePurchasesPage';
import { renderWithRouter } from '../../../utils/testing/customRender';
import { ManipulatableQueryWrapper } from '../../../Components/util/testing/ManipulatableQueryWrapper';
import { HydrateAtomsTestProvider } from '../../../Components/util/testing/HydrateAtomsTestProvider';
import { useHasRelation } from '../../../hooks/util/useHasRelation';
import { MarketplacePurchasesPaginationData } from '../../../state/marketplacePurchases';
jest.mock('../../../hooks/util/useHasRelation', () => ({
  Relation: {
    CLOUD_ACCESS_VIEW: 'cloud_access_view',
  },
  useHasRelation: jest.fn(),
}));

const mockedUseHasRelation = useHasRelation as jest.MockedFunction<
  typeof useHasRelation
>;
const defaultPagination = {
  page: 1,
  perPage: 10,
  itemCount: 0,
};

const marketplacePurchasesQueryKey = ['marketplacePurchases', 10, 0];
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

const TestPage = () => (
  <HydrateAtomsTestProvider
    initialValues={[[MarketplacePurchasesPaginationData, defaultPagination]]}
  >
    <MarketplacePurchasesPage />
  </HydrateAtomsTestProvider>
);

const { ComponentWithQueryClient, queryClient } = ManipulatableQueryWrapper(
  <TestPage />,
);

describe('Marketplace purchases page', () => {
  beforeEach(() => {
    queryClient.clear();
    mockedUseHasRelation.mockReturnValue({
      has: true,
      isLoading: false,
    });
  });
  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });
  it('renders the Marketplace Purchases page', async () => {
    queryClient.setQueryData(
      marketplacePurchasesQueryKey,
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
      marketplacePurchasesQueryKey,
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
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Azure')).toBeInTheDocument();
  });

  it('renders one row for each marketplace purchase', async () => {
    queryClient.setQueryData(
      marketplacePurchasesQueryKey,
      mockMarketplacePurchasesResponse,
    );
    renderWithRouter(<ComponentWithQueryClient />);
    await screen.findByText('Red Hat Enterprise Linux');
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('renders pagination using the API total', async () => {
    queryClient.setQueryData(
      marketplacePurchasesQueryKey,
      mockMarketplacePurchasesResponse,
    );
    const { container } = renderWithRouter(<ComponentWithQueryClient />);
    expect(
      await screen.findByText('Red Hat Enterprise Linux'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.pf-v6-c-pagination__total-items')?.textContent,
    ).toContain('1 - 2 of 2');
  });

  it('shows the empty state when no marketplace purchases exist', async () => {
    queryClient.setQueryData(marketplacePurchasesQueryKey, {
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
      marketplacePurchasesQueryKey,
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
        /marketplace purchases shows purchases made through AWS, Microsoft Azure, Google Cloud, Red Hat Marketplace, and IBM Cloud/i,
      ),
    ).toBeInTheDocument();
  });

  it('shows a loading state while permissions are loading', async () => {
    mockedUseHasRelation.mockReturnValue({
      has: false,
      isLoading: true,
    });
    queryClient.setQueryDefaults(marketplacePurchasesQueryKey, {
      queryFn: () => new Promise(() => undefined),
    });
    renderWithRouter(<ComponentWithQueryClient />);
    expect(await screen.findByLabelText(/contents/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/you have no marketplace purchases/i),
    ).not.toBeInTheDocument();
  });

  it('shows a loading state while marketplace purchases are loading', async () => {
    queryClient.setQueryDefaults(marketplacePurchasesQueryKey, {
      queryFn: () => new Promise(() => undefined),
    });
    renderWithRouter(<ComponentWithQueryClient />);
    expect(await screen.findByLabelText(/contents/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/you have no marketplace purchases/i),
    ).not.toBeInTheDocument();
  });
});
