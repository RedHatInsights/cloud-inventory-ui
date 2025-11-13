import React, { Suspense, lazy, useMemo } from 'react';
import {
  Navigate,
  Route as RouterRoute,
  Routes as RouterRoutes,
} from 'react-router-dom';
import { InvalidObject } from '@redhat-cloud-services/frontend-components/InvalidObject';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { GoldImagesPage } from './Pages/GoldImagesPage/GoldImagesPage';
import { Paths } from './utils/routing';
import CloudInventoryPage from './Pages/CloudInventoryPage/CloudInventoryPage';

const HelloPage = lazy(
  () =>
    import(
      /* webpackChunkName: "CloudInventoryPage" */ './Pages/CloudInventoryPage/CloudInventoryPage'
    )
);
const OopsPage = lazy(
  () => import(/* webpackChunkName: "OopsPage" */ './Pages/OopsPage/OopsPage')
);
const NoPermissionsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "NoPermissionsPage" */ './Pages/NoPermissionsPage/NoPermissionsPage'
    )
);

interface RouteDefinition {
  path: Paths;
  element:
    | React.LazyExoticComponent<() => React.JSX.Element>
    | (() => React.JSX.Element);
}

const routes: RouteDefinition[] = [
  {
    path: Paths.NoPermissions,
    element: NoPermissionsPage,
  },
  {
    path: Paths.Oops,
    element: OopsPage,
  },
  {
    path: Paths.Root,
    element: () => <Navigate to={`./${Paths.GoldImages}`} />,
  },
  {
    path: Paths.GoldImages,
    element: GoldImagesPage,
  },
  {
    path: Paths.Root,
    element: () => <Navigate to={`./${Paths.CloudAccounts}`} />,
  },
  {
    path: Paths.CloudAccounts,
    element: CloudInventoryPage,
  },
  {
    path: Paths.MarketplacePurchases,
    element: HelloPage,
  },
  /* Catch all unmatched routes */
  {
    path: Paths.Catch,
    element: () => <InvalidObject />,
  },
];

const renderRoutes = (routes: RouteDefinition[] = []) =>
  routes.map(({ path, element: Element }) => (
    <RouterRoute key={path} path={path} element={<Element />}></RouterRoute>
  ));

const Routing = () => {
  const renderedRoutes = useMemo(() => renderRoutes(routes), [routes]);
  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      <RouterRoutes>{renderedRoutes}</RouterRoutes>
    </Suspense>
  );
};

export default Routing;
