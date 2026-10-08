import React from 'react';
import { ExpandableRowContent, Td, Tr } from '@patternfly/react-table';
import { Button, Grid, GridItem } from '@patternfly/react-core';
import { useMarketplacePurchasesSkuDetails } from '../../hooks/api/useMarketplacePurchasesSkuDetails';
import { Loading } from '../util/Loading';
import { Link } from 'react-router-dom';
import { MarketplacePurchasesSubscriptionsModal } from './MarketplacePurchasesSubscriptionsModal';

type MarketplacePurchasesSubscriptionsProps = {
  skus: string[];
  marketplaceAccount: string;
  offeringName: string;
  isExpanded: boolean;
};

export const MarketplacePurchasesSubscriptions = ({
  skus,
  isExpanded,
  offeringName,
  marketplaceAccount
}: MarketplacePurchasesSubscriptionsProps) => {
  const { data, isLoading, isError } = useMarketplacePurchasesSkuDetails(skus);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (isLoading) {
    return (
      <Tr isExpanded={isExpanded}>
        <Td />
        <Td colSpan={4}>
          <ExpandableRowContent>
            <Loading />
          </ExpandableRowContent>
        </Td>
      </Tr>
    );
  }

  if (isError) {
    return (
      <Tr isExpanded={isExpanded}>
        <Td colSpan={5}>
          <ExpandableRowContent>
            <Grid hasGutter>
              {skus.map((sku) => (
                <GridItem span={12} key={sku}>
                  The request for subscription names failed. For more information, view{' '}
                  <Link to={`/subscriptions/inventory/${sku}`}>{sku}</Link>
                  {' details. '}
                </GridItem>
              ))}
            </Grid>
          </ExpandableRowContent>
        </Td>
      </Tr>
    );
  }

  const MAX_VISIBLE_SUBSCRIPTIONS = 5;
  const visibleSubscriptions = data?.body.slice(0, MAX_VISIBLE_SUBSCRIPTIONS) ?? [];
  const hasMoreSubscriptions = (data?.body.length ?? 0) > MAX_VISIBLE_SUBSCRIPTIONS;

  return (
    <>
      <Tr isExpanded={isExpanded}>
        <Td />
        <Td colSpan={4}>
          <ExpandableRowContent>
            <Grid hasGutter>
              <GridItem span={12}>
                <Grid>
                  <GridItem span={4}>
                    <strong>Subscription name</strong>
                  </GridItem>
                  <GridItem span={4}>
                    <strong>SKU</strong>
                  </GridItem>
                </Grid>
              </GridItem>
              {visibleSubscriptions.map(({ sku, description }) => (
                <GridItem span={12} key={sku}>
                  <Grid>
                    <GridItem span={4}>
                      <Link to={`/subscriptions/inventory/${sku}`}>{description}</Link>
                    </GridItem>
                    <GridItem span={4}>{sku}</GridItem>
                  </Grid>
                </GridItem>
              ))}
              {hasMoreSubscriptions && (
                <Button variant="link" isInline onClick={() => setIsModalOpen(true)}>
                  View more
                </Button>
              )}
            </Grid>
          </ExpandableRowContent>
        </Td>
      </Tr>
      <MarketplacePurchasesSubscriptionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscriptions={data?.body ?? []}
        marketplaceAccount={marketplaceAccount}
        offeringName={offeringName}
      />
    </>
  );
};
