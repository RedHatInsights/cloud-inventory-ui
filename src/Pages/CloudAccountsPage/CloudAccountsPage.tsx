import React, { useEffect } from 'react';
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
import {
  useQueryParamBatchRef,
  useQueryParamInformedAtom,
  useQueryParamInformedState,
} from '../../hooks/util/useQueryParam';
import { CloudAccountsPaginationData } from '../../state/cloudAccounts';
import { SortByDirection } from '@patternfly/react-table';

export const CloudAccountsPage = () => {
  const batchRef = useQueryParamBatchRef();

  const [pagination, setPagination] = useQueryParamInformedAtom(
    CloudAccountsPaginationData,
    'pagination',
  );

  const [sortBy, setSortBy] = useQueryParamInformedState<string | undefined>(
    undefined,
    'cloudAccountsActiveSortBy',
    batchRef,
  );
  const [sortDir, setSortDir] = useQueryParamInformedState<
    SortByDirection | undefined
  >(undefined, 'cloudAccountsActiveSortDir', batchRef);

  const { page, perPage } = pagination;

  const {
    data: cloudAccountsResponse,
    isError: isCloudAccountsError,
    isLoading: areCloudAccountsLoading,
  } = useCloudAccounts({
    limit: perPage,
    offset: (page - 1) * perPage,
    sortField: sortBy,
    sortDirection: sortDir,
  });

  const accounts = cloudAccountsResponse?.body ?? [];

  const hasAccounts = accounts.length > 0;
  useEffect(() => {
    if (cloudAccountsResponse?.pagination) {
      setPagination({
        ...pagination,
        itemCount: cloudAccountsResponse.pagination.total,
      });
    }
  }, [cloudAccountsResponse?.pagination?.total]);

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
        <Content component="h1">Cloud Accounts</Content>
      </PageHeader>
      <Section>
        <PageSection>
          {!hasAccounts && <NoCloudAccounts />}
          {hasAccounts && (
            <>
              <CloudAccountsToolbar />
              <CloudAccountsTable
                cloudAccounts={accounts}
                sortBy={sortBy}
                sortDir={sortDir}
                setSortBy={setSortBy}
                setSortDir={setSortDir}
              />
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
