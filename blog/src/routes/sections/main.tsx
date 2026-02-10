import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const AiLLMListPage = lazy(() => import('src/pages/ai-llm/list'));
const AiLLMDetailPage = lazy(() => import('src/pages/ai-llm/details'));
const JsListPage = lazy(() => import('src/pages/javascript/list'));
const JsDetailPage = lazy(() => import('src/pages/javascript/details'));
const ReactListPage = lazy(() => import('src/pages/react/list'));
const ReactDetailPage = lazy(() => import('src/pages/react/details'));
const VueListPage = lazy(() => import('src/pages/vuejs/list'));
const VueDetailPage = lazy(() => import('src/pages/vuejs/details'));
const KeycloakListPage = lazy(() => import('src/pages/keycloak/list'));
const KeycloakDetailPage = lazy(() => import('src/pages/keycloak/details'));
const TroubleListPage = lazy(() => import('src/pages/troubleshooting/list'));
const TroubleDetailPage = lazy(() => import('src/pages/troubleshooting/details'));

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
            path: 'ai-llm',
            children: [
              { element: <AiLLMListPage />, index: true },
              { path: 'list', element: <AiLLMListPage /> },
              { path: ':title', element: <AiLLMDetailPage /> },
            ],
          },
          {
            path: 'javascript',
            children: [
              { element: <JsListPage />, index: true },
              { path: 'list', element: <JsListPage /> },
              { path: ':title', element: <JsDetailPage /> },
            ],
          },
          {
            path: 'react',
            children: [
              { element: <ReactListPage />, index: true },
              { path: 'list', element: <ReactListPage /> },
              { path: ':title', element: <ReactDetailPage /> },
            ],
          },
          {
            path: 'vuejs',
            children: [
              { element: <VueListPage />, index: true },
              { path: 'list', element: <VueListPage /> },
              { path: ':title', element: <VueDetailPage /> },
            ],
          },
          {
            path: 'keycloak',
            children: [
              { element: <KeycloakListPage />, index: true },
              { path: 'list', element: <KeycloakListPage /> },
              { path: ':title', element: <KeycloakDetailPage /> },
            ],
          },
          {
            path: 'troubleshooting',
            children: [
              { element: <TroubleListPage />, index: true },
              { path: 'list', element: <TroubleListPage /> },
              { path: ':title', element: <TroubleDetailPage /> },
            ],
          },
        ],
      },
    ],
  },
];
