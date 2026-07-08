import React, { Fragment, useEffect } from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import Routing from './Routing';
import './App.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';

const queryClient = new QueryClient();

const App = () => {
  const { updateDocumentTitle } = useChrome();

  useEffect(() => {
    // You can use directly the name of your app
    updateDocumentTitle('Cloud Inventory');
  }, []);

  return (
    <Fragment>
      <AccessCheck.Provider
        baseUrl={window.location.origin}
        apiPath="/api/kessel/v1beta2"
      >
        <QueryClientProvider client={queryClient}>
          <NotificationsProvider />
          <Routing />
        </QueryClientProvider>
      </AccessCheck.Provider>
    </Fragment>
  );
};
export default App;
