import { RouteObject } from 'react-router-dom';
import { AppRouteObject } from '../types';
import { Suspense } from 'react';
import { AuthGuard } from '../guards/authGuard';
import { PermissionGuard } from '../guards/authGuard';

/**
 * 为路由组件添加懒加载包装
 * @param route 路由配置
 * @returns 添加了懒加载包装的路由配置
 */
export const withLazyLoading = (route: AppRouteObject): AppRouteObject => {
  if (!route.element) return route;

  return {
    ...route,
    element: (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-text-secondary">加载中...</p>
        </div>
      </div>}>
        <AuthGuard>
          <PermissionGuard>
            {route.element}
          </PermissionGuard>
        </AuthGuard>
      </Suspense>
    ),
  };
};

/**
 * 递归处理路由配置，添加懒加载和守卫
 * @param routes 路由配置数组
 * @returns 处理后的路由配置数组
 */
export const processRoutes = (routes: AppRouteObject[]): RouteObject[] => {
  return routes.map(route => {
    // 处理当前路由
    const processedRoute = withLazyLoading(route);
    
    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      return {
        ...processedRoute,
        children: processRoutes(route.children),
      } as RouteObject;
    }
    
    return processedRoute as RouteObject;
  });
};

/**
 * 合并多个路由模块
 * @param routeModules 路由模块数组
 * @returns 合并后的路由配置数组
 */
export const mergeRoutes = (...routeModules: AppRouteObject[]): AppRouteObject[] => {
  return routeModules;
};

/**
 * 根据路由名称查找路由配置
 * @param routes 路由配置数组
 * @param name 路由名称
 * @returns 找到的路由配置，找不到则返回null
 */
export const findRouteByName = (
  routes: AppRouteObject[],
  name: string
): AppRouteObject | null => {
  for (const route of routes) {
    if (route.name === name) {
      return route;
    }
    if (route.children && route.children.length > 0) {
      const found = findRouteByName(route.children, name);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/**
 * 根据路径查找路由配置
 * @param routes 路由配置数组
 * @param path 路由路径
 * @returns 找到的路由配置，找不到则返回null
 */
export const findRouteByPath = (
  routes: AppRouteObject[],
  path: string
): AppRouteObject | null => {
  for (const route of routes) {
    if (route.path === path) {
      return route;
    }
    if (route.children && route.children.length > 0) {
      const found = findRouteByPath(route.children, path);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/**
 * 获取所有需要在菜单中显示的路由
 * @param routes 路由配置数组
 * @returns 菜单路由配置数组
 */
export const getMenuRoutes = (routes: AppRouteObject[]): AppRouteObject[] => {
  const menuRoutes: AppRouteObject[] = [];
  
  const collectMenuRoutes = (routeList: AppRouteObject[]) => {
    for (const route of routeList) {
      if (route.meta.showInMenu) {
        menuRoutes.push(route);
      }
      if (route.children && route.children.length > 0) {
        collectMenuRoutes(route.children);
      }
    }
  };
  
  collectMenuRoutes(routes);
  
  // 根据order排序
  return menuRoutes.sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0));
};
