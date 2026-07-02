import { Content, PageSection } from '@patternfly/react-core';
import React from 'react';
import { useGoldImages } from '../../hooks/api/useGoldImages';
import { Loading } from '../../Components/util/Loading';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { GoldImagesTable } from '../../Components/GoldImages/GoldImagesTable';
import { Link, Navigate } from 'react-router-dom';
import { Paths } from '../../utils/routing';
import { GoldImagesToolbar } from '../../Components/GoldImages/GoldImagesToolbar';
import { GoldImagesPagination } from '../../Components/GoldImages/GoldImagesPagination';
import { Section } from '@redhat-cloud-services/frontend-components/Section';
import { NoGoldImages } from '../../Components/GoldImages/NoGoldImages';
import { Relation, useHasRelation } from '../../hooks/util/useHasRelation';

export const GoldImagesPage = () => {
  const {
    data: goldImages,
    isError: isGoldImageError,
    isLoading: areGoldImagesLoading,
  } = useGoldImages();
  const { has: canReadCloudAccess, isLoading } = useHasRelation(
    Relation.CLOUD_ACCESS_VIEW,
  );

  // Permission gate
  if (isLoading) return <Loading />;
  if (!canReadCloudAccess) return <Navigate to={`../${Paths.NoPermissions}`} />;

  // Query gate
  if (areGoldImagesLoading) return <Loading />;
  if (isGoldImageError) return <Unavailable />;

  const noGoldImages = !goldImages || Object.keys(goldImages).length == 0;

  return (
    <>
      <PageHeader>
        <Content component="h1">Gold Images</Content>
        <Content component="p">
          This is a listing of the gold images available to your organization,
          based on your subscriptions. Learn more about gold images. To see
          which cloud accounts have gold image access enabled, view the list of
          your <Link to={`../${Paths.CloudAccounts}`}>cloud accounts.</Link>
        </Content>
      </PageHeader>
      <Section>
        <PageSection>
          {noGoldImages && <NoGoldImages />}
          {!noGoldImages && (
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
