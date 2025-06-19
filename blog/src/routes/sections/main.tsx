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

// Error
const Page500 = lazy(() => import('src/pages/sample/error/500'));
const Page403 = lazy(() => import('src/pages/sample/error/403'));
const Page404 = lazy(() => import('src/pages/sample/error/404'));

// // Overview
// const OverviewEcommercePage = lazy(() => import('src/pages/sample/ecommerce'));
// const OverviewAnalyticsPage = lazy(() => import('src/pages/sample/analytics'));
// const OverviewBankingPage = lazy(() => import('src/pages/sample/banking'));
// const OverviewBookingPage = lazy(() => import('src/pages/sample/booking'));
// const OverviewFilePage = lazy(() => import('src/pages/sample/file'));
// const OverviewCoursePage = lazy(() => import('src/pages/sample/course'));
// // Product
// const ProductDetailsPage = lazy(() => import('src/pages/sample/product/details'));
// const ProductListPage = lazy(() => import('src/pages/sample/product/list'));
// const ProductCreatePage = lazy(() => import('src/pages/sample/product/new'));
// const ProductEditPage = lazy(() => import('src/pages/sample/product/edit'));
// // Order
// const OrderListPage = lazy(() => import('src/pages/sample/order/list'));
// const OrderDetailsPage = lazy(() => import('src/pages/sample/order/details'));
// // Invoice
// const InvoiceListPage = lazy(() => import('src/pages/sample/invoice/list'));
// const InvoiceDetailsPage = lazy(() => import('src/pages/sample/invoice/details'));
// const InvoiceCreatePage = lazy(() => import('src/pages/sample/invoice/new'));
// const InvoiceEditPage = lazy(() => import('src/pages/sample/invoice/edit'));
// // User
// const UserProfilePage = lazy(() => import('src/pages/sample/user/profile'));
// const UserCardsPage = lazy(() => import('src/pages/sample/user/cards'));
// const UserListPage = lazy(() => import('src/pages/sample/user/list'));
// const UserAccountPage = lazy(() => import('src/pages/sample/user/account'));
// const UserCreatePage = lazy(() => import('src/pages/sample/user/new'));
// const UserEditPage = lazy(() => import('src/pages/sample/user/edit'));
// // Blog
// const BlogPostsPage = lazy(() => import('src/pages/post/list'));
// const BlogPostPage = lazy(() => import('src/pages/post/details'));
// const BlogNewPostPage = lazy(() => import('src/pages/post/new'));
// const BlogEditPostPage = lazy(() => import('src/pages/post/edit'));
// // Job
// const JobDetailsPage = lazy(() => import('src/pages/sample/job/details'));
// const JobListPage = lazy(() => import('src/pages/sample/job/list'));
// const JobCreatePage = lazy(() => import('src/pages/sample/job/new'));
// const JobEditPage = lazy(() => import('src/pages/sample/job/edit'));
// // Tour
// const TourDetailsPage = lazy(() => import('src/pages/sample/tour/details'));
// const TourListPage = lazy(() => import('src/pages/sample/tour/list'));
// const TourCreatePage = lazy(() => import('src/pages/sample/tour/new'));
// const TourEditPage = lazy(() => import('src/pages/sample/tour/edit'));
// // File manager
// const FileManagerPage = lazy(() => import('src/pages/sample/file-manager'));
// // App
// const ChatPage = lazy(() => import('src/pages/sample/chat'));
// const MailPage = lazy(() => import('src/pages/sample/mail'));
// const CalendarPage = lazy(() => import('src/pages/sample/calendar'));
// const KanbanPage = lazy(() => import('src/pages/sample/kanban'));
// // Test render page by role
// const PermissionDeniedPage = lazy(() => import('src/pages/sample/permission'));
// // Blank page
// const ParamsPage = lazy(() => import('src/pages/sample/params'));
// const BlankPage = lazy(() => import('src/pages/sample/blank'));

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
          // { path: 'ecommerce', element: <OverviewEcommercePage /> },
          // { path: 'analytics', element: <OverviewAnalyticsPage /> },
          // { path: 'banking', element: <OverviewBankingPage /> },
          // { path: 'booking', element: <OverviewBookingPage /> },
          // { path: 'file', element: <OverviewFilePage /> },
          // { path: 'course', element: <OverviewCoursePage /> },
          // {
          //   path: 'user',
          //   children: [
          //     { element: <UserProfilePage />, index: true },
          //     { path: 'profile', element: <UserProfilePage /> },
          //     { path: 'cards', element: <UserCardsPage /> },
          //     { path: 'list', element: <UserListPage /> },
          //     { path: 'new', element: <UserCreatePage /> },
          //     { path: ':id/edit', element: <UserEditPage /> },
          //     { path: 'account', element: <UserAccountPage /> },
          //   ],
          // },
          // {
          //   path: 'product',
          //   children: [
          //     { element: <ProductListPage />, index: true },
          //     { path: 'list', element: <ProductListPage /> },
          //     { path: ':id', element: <ProductDetailsPage /> },
          //     { path: 'new', element: <ProductCreatePage /> },
          //     { path: ':id/edit', element: <ProductEditPage /> },
          //   ],
          // },
          // {
          //   path: 'order',
          //   children: [
          //     { element: <OrderListPage />, index: true },
          //     { path: 'list', element: <OrderListPage /> },
          //     { path: ':id', element: <OrderDetailsPage /> },
          //   ],
          // },
          // {
          //   path: 'invoice',
          //   children: [
          //     { element: <InvoiceListPage />, index: true },
          //     { path: 'list', element: <InvoiceListPage /> },
          //     { path: ':id', element: <InvoiceDetailsPage /> },
          //     { path: ':id/edit', element: <InvoiceEditPage /> },
          //     { path: 'new', element: <InvoiceCreatePage /> },
          //   ],
          // },
          // {
          //   path: 'post',
          //   children: [
          //     { element: <BlogPostsPage />, index: true },
          //     { path: 'list', element: <BlogPostsPage /> },
          //     { path: ':title', element: <BlogPostPage /> },
          //     { path: ':title/edit', element: <BlogEditPostPage /> },
          //     { path: 'new', element: <BlogNewPostPage /> },
          //   ],
          // },
          // {
          //   path: 'job',
          //   children: [
          //     { element: <JobListPage />, index: true },
          //     { path: 'list', element: <JobListPage /> },
          //     { path: ':id', element: <JobDetailsPage /> },
          //     { path: 'new', element: <JobCreatePage /> },
          //     { path: ':id/edit', element: <JobEditPage /> },
          //   ],
          // },
          // {
          //   path: 'tour',
          //   children: [
          //     { element: <TourListPage />, index: true },
          //     { path: 'list', element: <TourListPage /> },
          //     { path: ':id', element: <TourDetailsPage /> },
          //     { path: 'new', element: <TourCreatePage /> },
          //     { path: ':id/edit', element: <TourEditPage /> },
          //   ],
          // },
          // { path: 'file-manager', element: <FileManagerPage /> },
          // { path: 'mail', element: <MailPage /> },
          // { path: 'chat', element: <ChatPage /> },
          // { path: 'calendar', element: <CalendarPage /> },
          // { path: 'kanban', element: <KanbanPage /> },
          // { path: 'permission', element: <PermissionDeniedPage /> },
          // { path: 'params', element: <ParamsPage /> },
          // { path: 'blank', element: <BlankPage /> },

          { path: '500', element: <Page500 /> },
          { path: '404', element: <Page404 /> },
          { path: '403', element: <Page403 /> },
        ],
      },
    ],
  },
];
