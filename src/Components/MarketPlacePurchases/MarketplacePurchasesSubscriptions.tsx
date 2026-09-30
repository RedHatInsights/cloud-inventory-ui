import React from 'react';
import { ExpandableRowContent, Td, Tr } from '@patternfly/react-table';
import { Grid, GridItem } from '@patternfly/react-core';
import { useMarketplacePurchasesSkuDetails } from '../../hooks/api/useMarketplacePurchasesSkuDetails';
import { Loading } from '../util/Loading';
import { Link } from 'react-router-dom';

type MarketplacePurchasesSubscriptionsProps = {
  skus: string[];
  isExpanded: boolean;
};

export const MarketplacePurchasesSubscriptions = ({
  skus,
  isExpanded
}: MarketplacePurchasesSubscriptionsProps) => {
  const { data, isLoading, isError } = useMarketplacePurchasesSkuDetails(skus);

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
              {data?.body.map(({ sku, description }) => (
                <GridItem span={12} key={sku}>
                  <Grid>
                    <GridItem span={4}>
                      <Link to={`/subscriptions/inventory/${sku}`}>{description}</Link>
                    </GridItem>
                    <GridItem span={4}>{sku}</GridItem>
                  </Grid>
                </GridItem>
              ))}
            </Grid>
          </ExpandableRowContent>
        </Td>
      </Tr>
    </>
  );
};
