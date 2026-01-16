import { AppRouteObject } from '../types';
import { lazy } from 'react';

// 懒加载路由组件
const DashboardLayout = lazy(() => import('@/Layout/DashboardLayout'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UploadPage = lazy(() => import('@/pages/UploadPage'));
const BookmarkList = lazy(() => import('@/pages/BookmarkListPage'));
const DuplicateCheck = lazy(() => import('@/pages/DuplicateCheck'));

// 主路由配置
export const mainRoutes: AppRouteObject = {
  path: '/',
  element: <DashboardLayout />,
  meta: {
    title: '主布局',
    requiresAuth: false,
    showInMenu: false,
  },
  children: [
    {
      path: '',
      name: 'home',
      element: <Dashboard />,
      meta: {
        title: '仪表盘',
        requiresAuth: false,
        showInMenu: true,
        icon: 'dashboard',
        order: 1,
      },
    },
    {
      path: 'bookmarks',
      name: 'bookmarkList',
      element: <BookmarkList />,
      meta: {
        title: '书签列表',
        requiresAuth: false,
        showInMenu: true,
        icon: 'bookmark',
        order: 2,
      },
    },
    {
      path: 'upload',
      name: 'upload',
      element: <UploadPage />,
      meta: {
        title: '上传书签',
        requiresAuth: false,
        showInMenu: true,
        icon: 'upload',
        order: 3,
      },
    },
    {
      path: 'duplicates',
      name: 'duplicateCheck',
      element: <DuplicateCheck />,
      meta: {
        title: '重复检查',
        requiresAuth: false,
        showInMenu: true,
        icon: 'copy',
        order: 4,
      },
    },
  ],
};
