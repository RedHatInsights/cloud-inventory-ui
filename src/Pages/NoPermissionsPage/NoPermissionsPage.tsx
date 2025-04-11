import React, { useEffect } from 'react';

import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const NoPermissionsPage = () => {
  const { appAction } = useChrome();

  useEffect(() => {
    appAction('no-permissions');
  }, []);

  return (
    <Main>
      <NotAuthorized serviceName="Cloud Inventory" />
    </Main>
  );
};

export default NoPermissionsPage;
