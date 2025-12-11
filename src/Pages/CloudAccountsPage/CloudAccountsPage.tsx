import React from 'react';
import { CloudAccountsTable } from '../../Components/CloudAccounts/CloudAccountsTable';
import { Content, PageSection } from '@patternfly/react-core';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { CloudAccountsPagination } from '../../Components/CloudAccounts/CloudAccountsPagination';
import { CloudAccountsToolbar } from '../../Components/CloudAccounts/CloudAccountsToolbar';
import { useCloudAccounts } from '../../hooks/api/useCloudAccounts';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { Navigate } from 'react-router-dom';
import { Loading } from '../../Components/util/Loading';
import { useRbacPermission } from '../../hooks/util/useRbacPermissions';
import { Paths } from '../../utils/routing';
import { NoCloudAccounts } from '../../Components/CloudAccounts/NoCloudAccounts';

export const CloudAccountsPage = () => {
  const {
    data: cloudAccountsResponse,
    isError: isCloudAccountsError,
    isLoading: areCloudAccountsLoading,
  } = useCloudAccounts();

  const accounts = cloudAccountsResponse?.body ?? [];
  const hasAccounts = accounts.length > 0;

  const { data: permissions, isLoading: arePermissionsLoading } =
    useRbacPermission();

  if (arePermissionsLoading) return <Loading />;
  if (!permissions?.canReadCloudAccess)
    return <Navigate to={`../${Paths.NoPermissions}`} />;

  if (areCloudAccountsLoading) return <Loading />;
  if (isCloudAccountsError) return <Unavailable />;

  return (
    <>
      <PageHeader>
        <Content component="h1">Cloud Inventory</Content>
      </PageHeader>
      <Section>
        <PageSection>
          {!hasAccounts && <NoCloudAccounts />}
          {hasAccounts && (
            <>
              <CloudAccountsToolbar />
              <CloudAccountsTable cloudAccounts={accounts} />
              <br />
              <CloudAccountsPagination />
            </>
          )}
        </PageSection>
      </Section>
    </>
  );
};

export default CloudAccountsPage;
