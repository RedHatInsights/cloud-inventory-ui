import React, { Fragment, useEffect } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/Portal';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useAtomValue } from 'jotai';

import Routing from './Routing';
import {
  notificationsAtom,
  useClearNotifications,
  useRemoveNotification,
} from './state/notificationsAtom';
import './App.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = () => {
  const { updateDocumentTitle } = useChrome();
  const notifications = useAtomValue(notificationsAtom);
  const removeNotification = useRemoveNotification();
  const clearNotifications = useClearNotifications();
  const queryClient = new QueryClient();

  useEffect(() => {
    // You can use directly the name of your app
    updateDocumentTitle('Cloud Inventory');
  }, []);

  return (
    <Fragment>
      <QueryClientProvider client={queryClient}>
        <NotificationsPortal
          removeNotification={removeNotification}
          onClearAll={clearNotifications}
          notifications={notifications}
        />
        <Routing />
      </QueryClientProvider>
    </Fragment>
  );
};

export default App;
