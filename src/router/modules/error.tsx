import { AppRouteObject } from '../types';
import { lazy } from 'react';

// 懒加载错误页面组件
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));

// 错误路由配置
export const errorRoutes: AppRouteObject = {
  path: '*',
  name: 'error',
  meta: {
    title: '错误页面',
    requiresAuth: false,
    showInMenu: false,
  },
  children: [
    {
      path: '404',
      name: 'notFound',
      element: <NotFoundPage />,
      meta: {
        title: '页面未找到',
        requiresAuth: false,
        showInMenu: false,
      },
    },
    {
      path: '500',
      name: 'serverError',
      element: <ErrorPage />,
      meta: {
        title: '服务器错误',
        requiresAuth: false,
        showInMenu: false,
      },
    },
    {
      path: '*',
      name: 'defaultError',
      element: <NotFoundPage />,
      meta: {
        title: '页面未找到',
        requiresAuth: false,
        showInMenu: false,
      },
    },
  ],
};
