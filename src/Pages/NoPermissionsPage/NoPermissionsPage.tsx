import React, { useEffect } from 'react';

import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

const NoPermissionsPage = () => {
  const { appAction } = useChrome();

  useEffect(() => {
    appAction('no-permissions');
  }, []);

  return (
    <Section>
      <NotAuthorized serviceName="Cloud Inventory" />
    </Section>
  );
};

export default NoPermissionsPage;
