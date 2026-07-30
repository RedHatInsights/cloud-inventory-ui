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
import { useMarketplacePurchases } from '../../hooks/api/useMarketplacePurchases';
import { Relation, useHasRelation } from '../../hooks/util/useHasRelation';
import { useQueryParamInformedAtom } from '../../hooks/util/useQueryParam';
import { hasPaginationError } from '../../utils/errors';
import { Paths } from '../../utils/routing';
import { MarketplacePurchasesPaginationData } from '../../state/marketplacePurchases';
import { MarketplacePurchasesPagination } from '../../Components/MarketPlacePurchases/MarketplacePurchasesPagination';
import { MarketplacePurchasesToolbar } from '../../Components/MarketPlacePurchases/MarketplacePurchasesToolbar';

const MarketplacePurchasesPage = () => {
  const [pagination, setPagination] = useQueryParamInformedAtom(
    MarketplacePurchasesPaginationData,
    'pagination',
  );

  const { page, perPage } = pagination;
  const { has: canReadCloudAccess, isLoading: isPermissionsLoading } =
    useHasRelation(Relation.CLOUD_ACCESS_VIEW);
  const canFetchMarketplacePurchases =
    !isPermissionsLoading && canReadCloudAccess;

  const {
    data: marketplacePurchasesResponse,
    isError: isMarketplacePurchasesError,
    isLoading: isMarketplacePurchasesLoading,
  } = useMarketplacePurchases(
    {
      limit: perPage,
      offset: (page - 1) * perPage,
    },
    canFetchMarketplacePurchases,
  );
  const marketplacePurchases = marketplacePurchasesResponse?.body ?? [];
  const hasMarketplacePurchases = marketplacePurchases.length > 0;

  useEffect(() => {
    if (marketplacePurchasesResponse?.pagination) {
      setPagination({
        ...pagination,
        itemCount: marketplacePurchasesResponse.pagination.total,
      });
    }
  }, [marketplacePurchasesResponse?.pagination?.total]);

  const shouldShowEmptyState =
    !hasMarketplacePurchases && !hasPaginationError(pagination);

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
              <MarketplacePurchasesTable
                marketplacePurchases={marketplacePurchases}
              />
              <br />
              <MarketplacePurchasesPagination />
            </>
          )}
        </PageSection>
      </Section>
    </>
  );
};

export default MarketplacePurchasesPage;
