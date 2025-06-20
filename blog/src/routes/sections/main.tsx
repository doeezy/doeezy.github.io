import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const JsListPage = lazy(() => import('src/pages/javascript/list'));
const JsDetailPage = lazy(() => import('src/pages/javascript/details'));
const ReactListPage = lazy(() => import('src/pages/react/list'));
const ReactDetailPage = lazy(() => import('src/pages/react/details'));
const VueListPage = lazy(() => import('src/pages/vuejs/list'));
const VueDetailPage = lazy(() => import('src/pages/vuejs/details'));
const NuxtListPage = lazy(() => import('src/pages/nuxtjs/list'));
const NuxtDetailPage = lazy(() => import('src/pages/nuxtjs/details'));
const KeycloakListPage = lazy(() => import('src/pages/keycloak/list'));
const KeycloakDetailPage = lazy(() => import('src/pages/keycloak/details'));
const TroubleListPage = lazy(() => import('src/pages/troubleshooting/list'));
const TroubleDetailPage = lazy(() => import('src/pages/troubleshooting/details'));

// Error
const Page500 = lazy(() => import('src/pages/sample/error/500'));
const Page403 = lazy(() => import('src/pages/sample/error/403'));
const Page404 = lazy(() => import('src/pages/sample/error/404'));

// ----------------------------------------------------------------------

const layoutContent = (
  <MainLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </MainLayout>
);

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: <>{layoutContent}</>,
        children: [
          {
            path: 'javascript',
            children: [
              { element: <JsListPage />, index: true },
              { path: ':title', element: <JsDetailPage /> },
            ],
          },
          {
            path: 'react',
            children: [
              { element: <ReactListPage />, index: true },
              { path: ':title', element: <ReactDetailPage /> },
            ],
          },
          {
            path: 'vuejs',
            children: [
              { element: <VueListPage />, index: true },
              { path: ':title', element: <VueDetailPage /> },
            ],
          },
          {
            path: 'nuxtjs',
            children: [
              { element: <NuxtListPage />, index: true },
              { path: ':title', element: <NuxtDetailPage /> },
            ],
          },
          {
            path: 'keycloak',
            children: [
              { element: <KeycloakListPage />, index: true },
              { path: ':title', element: <KeycloakDetailPage /> },
            ],
          },
          {
            path: 'troubleshooting',
            children: [
              { element: <TroubleListPage />, index: true },
              { path: ':title', element: <TroubleDetailPage /> },
            ],
          },
          { path: '500', element: <Page500 /> },
          { path: '404', element: <Page404 /> },
          { path: '403', element: <Page403 /> },
        ],
      },
    ],
  },
];
