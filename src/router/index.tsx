/**
 * 路由配置
 */

import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layouts
import Header from '../layout/Header';
import Sidebar from '../layout/Sidebar';

// Pages
import HomePage from '../pages/home/HomePage';

// Lazy loaded pages
const BookmarkView = lazy(() => import('../pages/bookmark/BookmarkView'));
const TagCloudVisualization = lazy(() => import('../common/TagCloudVisualization'));
const QualityMonitor = lazy(() => import('../common/QualityMonitor'));
const PrivateVault = lazy(() => import('../pages/bookmark/PrivateVault'));
const AIConfirmationPanel = lazy(() => import('../common/AIConfirmationPanel'));

// 加载中组件
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-gray-500">加载中...</div>
  </div>
);

// 带侧边栏的布局
const MainLayout = () => (
  <div className="min-h-full flex flex-col bg-gray-50">
    <Header />
    <div className="flex-1 flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  </div>
);

// 首页布局（无侧边栏）
const HomeLayout = () => (
  <div className="min-h-full flex flex-col bg-gray-50">
    <Header />
    <main className="flex-1 overflow-auto">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <HomePage onNavigate={(path) => window.location.href = path} />,
      },
    ],
  },
  {
    path: '/app',
    element: <MainLayout />,
    children: [
      {
        path: 'bookmarks',
        element: <BookmarkView />,
      },
      {
        path: 'analytics',
        element: <TagCloudVisualization bookmarks={[]} />,
      },
      {
        path: 'quality',
        element: <QualityMonitor bookmarks={[]} />,
      },
      {
        path: 'private',
        element: <PrivateVault onUnlock={() => console.log('Unlocked')} />,
      },
      {
        path: 'ai',
        element: <AIConfirmationPanel onClose={() => window.history.back()} />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

// 路由路径常量
export const ROUTES = {
  HOME: '/',
  BOOKMARKS: '/app/bookmarks',
  ANALYTICS: '/app/analytics',
  QUALITY: '/app/quality',
  PRIVATE: '/app/private',
  AI: '/app/ai',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
