/**
 * 路由元信息类型定义
 * 包含路由的标题、权限、是否需要登录等信息
 */
export interface RouteMeta {
  /** 路由标题，用于面包屑、菜单等 */
  title: string;
  /** 是否需要登录权限 */
  requiresAuth: boolean;
  /** 路由权限列表，用于细粒度权限控制 */
  permissions?: string[];
  /** 是否在菜单中显示 */
  showInMenu: boolean;
  /** 菜单图标 */
  icon?: string;
  /** 路由顺序，用于菜单排序 */
  order?: number;
  /** 是否缓存路由组件 */
  keepAlive?: boolean;
  /** 面包屑自定义名称 */
  breadcrumbName?: string;
}

/**
 * 路由配置类型定义
 * 扩展 react-router-dom 的 RouteObject 类型，添加自定义元信息
 */
export interface AppRouteObject {
  /** 路由路径 */
  path: string;
  /** 路由组件 */
  element?: React.ReactNode;
  /** 路由子组件 */
  children?: AppRouteObject[];
  /** 路由元信息 */
  meta: RouteMeta;
  /** 路由名称，用于路由跳转 */
  name?: string;
  /** 路由重定向 */
  redirect?: string;
}

/**
 * 权限类型定义
 */
export interface Permission {
  /** 权限标识 */
  id: string;
  /** 权限名称 */
  name: string;
  /** 权限描述 */
  description?: string;
}

/**
 * 用户信息类型定义
 */
export interface UserInfo {
  /** 用户ID */
  id: string;
  /** 用户名 */
  username: string;
  /** 用户角色 */
  role: string;
  /** 用户权限列表 */
  permissions: Permission[];
  /** 登录状态 */
  isLoggedIn: boolean;
}
