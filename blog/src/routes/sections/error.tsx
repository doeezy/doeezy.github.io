import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { SimpleLayout } from 'src/layouts/simple';

import { SplashScreen } from 'src/components/loading-screen';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const Page500 = lazy(() => import('src/pages/error/500'));
const Page403 = lazy(() => import('src/pages/error/403'));
const Page404 = lazy(() => import('src/pages/error/404'));

// ----------------------------------------------------------------------

const layoutContent = (
  <SimpleLayout content={{ compact: true }}>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </SimpleLayout>
);

export const errorRoutes = [
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
          { path: '500', element: <Page500 /> },
          { path: '404', element: <Page404 /> },
          { path: '403', element: <Page403 /> },
        ],
      },
    ],
  },
];
