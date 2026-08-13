import React, { useEffect } from 'react';
import { Button, Content, PageSection, Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { Navigate } from 'react-router-dom';
import { Loading } from '../../Components/util/Loading';
import { MarketplacePurchasesTable } from '../../Components/MarketPlacePurchases/MarketplacePurchasesTable';
import { NoMarketplacePurchases } from '../../Components/MarketPlacePurchases/NoMarketplacePurchases';
import {
  MarketplacePurchaseSortField,
  useMarketplacePurchases
} from '../../hooks/api/useMarketplacePurchases';
import { Relation, useHasRelation } from '../../hooks/util/useHasRelation';
import {
  useQueryParamInformedAtom,
  useQueryParamInformedState
} from '../../hooks/util/useQueryParam';
import { hasPaginationError } from '../../utils/errors';
import { Paths } from '../../utils/routing';
import {
  MarketplaceAccountFilterData,
  MarketplaceFilterData,
  MarketplaceOfferingNameFilterData,
  MarketplacePurchasesPaginationData
} from '../../state/marketplacePurchases';
import { NoSearchResults } from '../../Components/EmptyState/NoSearchResults';
import { MarketplacePurchasesPagination } from '../../Components/MarketPlacePurchases/MarketplacePurchasesPagination';
import { MarketplacePurchasesToolbar } from '../../Components/MarketPlacePurchases/MarketplacePurchasesToolbar';
import { SortByDirection } from '@patternfly/react-table';

const MarketplacePurchasesPage = () => {
  const [pagination, setPagination] = useQueryParamInformedAtom(
    MarketplacePurchasesPaginationData,
    'pagination'
  );

  const [sortBy, setSortBy] = useQueryParamInformedState<MarketplacePurchaseSortField | undefined>(
    undefined,
    'marketplacePurchasesActiveSortBy'
  );

  const [sortDir, setSortDir] = useQueryParamInformedState<SortByDirection | undefined>(
    undefined,
    'marketplacePurchasesActiveSortDir'
  );
  const [offeringName, setOfferingName] = useQueryParamInformedAtom(
    MarketplaceOfferingNameFilterData,
    'offeringName'
  );

  const [marketplaceAccount, setMarketplaceAccount] = useQueryParamInformedAtom(
    MarketplaceAccountFilterData,
    'marketplaceAccount'
  );

  const [selectedMarketplaces, setSelectedMarketplaces] = useQueryParamInformedAtom(
    MarketplaceFilterData,
    'marketplace'
  );

  const clearMarketplaceFilters = () => {
    setOfferingName('');
    setMarketplaceAccount('');
    setSelectedMarketplaces([]);
    setPagination({
      ...pagination,
      page: 1
    });
  };

  const { page, perPage } = pagination;
  const { has: canReadCloudAccess, isLoading: isPermissionsLoading } = useHasRelation(
    Relation.CLOUD_ACCESS_VIEW
  );
  const canFetchMarketplacePurchases = !isPermissionsLoading && canReadCloudAccess;

  const {
    data: marketplacePurchasesResponse,
    isError: isMarketplacePurchasesError,
    isLoading: isMarketplacePurchasesLoading
  } = useMarketplacePurchases(
    {
      limit: perPage,
      offset: (page - 1) * perPage,
      sortField: sortBy,
      sortDirection: sortDir,
      offeringName,
      marketplaceAccount,
      marketplace: selectedMarketplaces
    },
    canFetchMarketplacePurchases
  );
  const marketplacePurchases = marketplacePurchasesResponse?.body ?? [];
  const hasMarketplacePurchases = marketplacePurchases.length > 0;

  useEffect(() => {
    if (marketplacePurchasesResponse?.pagination) {
      setPagination({
        ...pagination,
        itemCount: marketplacePurchasesResponse.pagination.total
      });
    }
  }, [marketplacePurchasesResponse?.pagination?.total]);

  const hasActiveFilters =
    offeringName !== '' || marketplaceAccount !== '' || selectedMarketplaces.length > 0;

  const shouldShowNoResults = !hasMarketplacePurchases && hasActiveFilters;

  const shouldShowEmptyState =
    !hasMarketplacePurchases && !hasActiveFilters && !hasPaginationError(pagination);

  if (isPermissionsLoading) {
    return <Loading />;
  }

  if (!canReadCloudAccess) {
    return <Navigate to={`../${Paths.NoPermissions}`} />;
  }

  if (isMarketplacePurchasesLoading) {
    return <Loading />;
  }

  if (isMarketplacePurchasesError) {
    return <Unavailable />;
  }

  return (
    <>
            
      <PageHeader>
        <Content component="h1">
          Marketplace Purchases           
          <Popover
            headerContent="Marketplace Purchases"
            bodyContent="Marketplace Purchases shows purchases made through AWS, Microsoft Azure, Google Cloud, Red Hat Marketplace, and IBM Cloud."
          >
            <Button
              variant="plain"
              aria-label="More information about Marketplace Purchases"
              icon={<HelpIcon />}
              className="pf-v6-u-ml-xs"
            />
          </Popover>
        </Content>
      </PageHeader>
      <Section>
        <PageSection>
          {shouldShowEmptyState ? (
            <NoMarketplacePurchases />
          ) : (
            <>
              <MarketplacePurchasesToolbar />
              {shouldShowNoResults ? (
                <NoSearchResults onClearFilters={clearMarketplaceFilters} />
              ) : (
                <>
                  <MarketplacePurchasesTable
                    marketplacePurchases={marketplacePurchases}
                    sortBy={sortBy}
                    sortDir={sortDir}
                    setSortBy={setSortBy}
                    setSortDir={setSortDir}
                  />
                  <br />
                  <MarketplacePurchasesPagination />
                </>
              )}
            </>
          )}
        </PageSection>
      </Section>
    </>
  );
};

export default MarketplacePurchasesPage;
