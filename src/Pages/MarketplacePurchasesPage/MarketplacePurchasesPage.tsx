import React from 'react';
import { Button, Content, PageSection, Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { Navigate } from 'react-router-dom';
import { Loading } from '../../Components/util/Loading';
import { useMarketplacePurchases } from '../../hooks/api/useMarketplacePurchases';
import { Relation, useHasRelation } from '../../hooks/util/useHasRelation';
import { Paths } from '../../utils/routing';
import { MarketplacePurchasesTable } from '../../Components/MarketPlacePurchases/MarketplacePurchasesTable';
import { NoMarketplacePurchases } from '../../Components/MarketPlacePurchases/NoMarketplacePurchases';

const MarketplacePurchasesPage = () => {
  const {
    data,
    isError: isMarketplacePurchasesError,
    isLoading: isMarketplacePurchasesLoading,
  } = useMarketplacePurchases();

  const { has: canReadCloudAccess, isLoading: isPermissionsLoading } =
    useHasRelation(Relation.CLOUD_ACCESS_VIEW);

  const marketplacePurchases = data?.body ?? [];
  const hasMarketplacePurchases = marketplacePurchases.length > 0;

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
          {hasMarketplacePurchases ? (
            <MarketplacePurchasesTable
              marketplacePurchases={marketplacePurchases}
            />
          ) : (
            <NoMarketplacePurchases />
          )}
        </PageSection>
      </Section>
    </>
  );
};

export default MarketplacePurchasesPage;
