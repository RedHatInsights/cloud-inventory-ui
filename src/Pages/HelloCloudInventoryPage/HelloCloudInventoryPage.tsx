import React from 'react';
import { Hello } from '../../Components/Hello';
import { Content, PageSection } from '@patternfly/react-core';

const HelloCloudInventory = () => {
  return (
    <>
      <PageSection>
        <Content component="h1">Cloud Inventory</Content>
      </PageSection>
      <PageSection>
        <Hello name="Cloud Inventory" />
      </PageSection>
    </>
  );
};

export default HelloCloudInventory;
