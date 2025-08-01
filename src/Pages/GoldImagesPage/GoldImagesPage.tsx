import { Content, PageSection } from '@patternfly/react-core';
import React from 'react';
import { useGoldImages } from '../../hooks/api/useGoldImages';
import { Loading } from '../../Components/util/Loading';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { GoldImagesTable } from '../../Components/GoldImages/GoldImagesTable';
import { useRbacPermission } from '../../hooks/util/useRbacPermissions';
import { Navigate } from 'react-router-dom';
import { Paths } from '../../utils/routing';
import { GoldImagesToolbar } from '../../Components/GoldImages/GoldImagesToolbar';
import { GoldImagesPagination } from '../../Components/GoldImages/GoldImagesPagination';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import { NoGoldImages } from '../../Components/GoldImages/NoGoldImages';

export const GoldImagesPage = () => {
  const {
    data: goldImages,
    isError: isGoldImageError,
    isLoading: areGoldImagesLoading,
  } = useGoldImages();
  const { data: permissions, isLoading: arePermissionsLoading } =
    useRbacPermission();

  // Permission gate
  if (arePermissionsLoading) return <Loading />;
  if (!permissions?.canReadCloudAccess)
    return <Navigate to={`../${Paths.NoPermissions}`} />;

  // Query gate
  if (areGoldImagesLoading) return <Loading />;
  if (isGoldImageError) return <Unavailable />;

  return (
    <>
      <PageHeader>
        <Content component="h1">Gold Images</Content>
        <Content component="p">
          This is a listing of the gold images available to your organization,
          based on your subscriptions. Learn more about gold images.
        </Content>
      </PageHeader>
      <Section>
        <PageSection>
          {(!goldImages || Object.keys(goldImages).length == 0) && (
            <NoGoldImages />
          )}
          {goldImages && (
            <>
              <GoldImagesToolbar goldImages={goldImages} />
              <GoldImagesTable goldImages={goldImages} />
              <br />
              <GoldImagesPagination />
            </>
          )}
        </PageSection>
      </Section>
    </>
  );
};
