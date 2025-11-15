import React from 'react';
import { CloudAccountsTable } from '../../Components/CloudAccounts/CloudAccountsTable';
import { Content, PageSection } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { CloudAccountsPagination } from '../../Components/CloudAccounts/CloudAccountsPagination';
import { CloudAccountsToolbar } from '../../Components/CloudAccounts/CloudAccountsToolbar';
// import { NoCloudAccounts } from '../../Components/CloudAccounts/NoCloudAccounts';

const CloudInventoryPage = () => {
  return (
    <>
      <PageHeader>
        <Content component="h1">Cloud Inventory</Content>
      </PageHeader>
      <Section>
        <PageSection>
          {/* {(!cloudAccounts || Object.keys(cloudAccounts).length == 0) && (
            <NoCloudAccounts />
          )} */}
          <>
            <CloudAccountsToolbar />
            <CloudAccountsTable />
            <br />
            <CloudAccountsPagination />
          </>
        </PageSection>
      </Section>
    </>
  );
};

export default CloudInventoryPage;
