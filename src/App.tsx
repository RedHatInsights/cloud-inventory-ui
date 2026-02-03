import React, { Fragment, useEffect } from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import Routing from './Routing';
import './App.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';

const queryClient = new QueryClient();

const App = () => {
  const { updateDocumentTitle } = useChrome();

  useEffect(() => {
    // You can use directly the name of your app
    updateDocumentTitle('Cloud Inventory');
  }, []);

  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider />
        <Routing />
      </QueryClientProvider>
    </Fragment>
  );
};

export default App;
