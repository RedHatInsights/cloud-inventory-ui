import React from 'react';
import { Button, Content, PageSection, Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

import { MarketplacePurchasesTable } from '../../Components/MarketPlacePurchases/MarketplacePurchasesTable';
import { NoMarketplacePurchases } from '../../Components/MarketPlacePurchases/NoMarketplacePurchases';
import { useMarketplacePurchases } from '../../hooks/api/useMarketplacePurchases';

const MarketplacePurchasesPage = () => {
  const { data } = useMarketplacePurchases({
    limit: 10,
    offset: 0,
  });

  const marketplacePurchases = data?.body ?? [];
  const hasMarketplacePurchases = marketplacePurchases.length > 0;

  return (
    <>
      <PageHeader>
        <Content component="h1">
          Marketplace Purchases           
          <Popover
            headerContent="Marketplace Purchases"
            bodyContent="Marketplace Purchases shows purchases made from AWS, Azure, Google Cloud, Red Hat Marketplace, and IBM Cloud Paks."
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
