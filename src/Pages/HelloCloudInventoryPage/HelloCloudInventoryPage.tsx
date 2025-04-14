import React from 'react';
import { Hello } from '../../Components/Hello';
import { Content, Page, PageSection } from '@patternfly/react-core';

const HelloCloudInventory = () => {
  return (
    <Page>
      <PageSection>
        <Content component="h1">Cloud Inventory</Content>
      </PageSection>
      <PageSection>
        <Hello name={'Cloud Inventory'} />
      </PageSection>
    </Page>
  );
};

export default HelloCloudInventory;
