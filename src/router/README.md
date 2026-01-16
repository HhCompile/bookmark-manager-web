# 路由系统文档

## 1. 路由系统概述

本项目采用 React Router v6 实现了企业级路由系统，具有以下特点：

- 路由模块化管理
- 路由懒加载优化
- 登录验证和权限控制
- 完善的错误处理机制
- 详细的路由元信息
- 统一的路由命名规范
- 支持路由缓存

## 2. 路由目录结构

```
src/router/
├── guards/           # 路由守卫
│   └── authGuard.tsx  # 登录验证和权限控制
├── modules/          # 路由模块
│   ├── main.tsx       # 主路由配置
│   └── error.tsx      # 错误路由配置
├── types/            # 路由类型定义
│   └── index.ts       # 路由元信息和配置类型
├── utils/            # 路由工具函数
│   └── index.ts       # 路由处理工具
├── index.tsx         # 路由入口文件
└── README.md         # 路由文档
```

## 3. 路由配置说明

### 3.1 路由元信息（RouteMeta）

| 属性名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| title | string | 是 | 路由标题，用于面包屑、菜单等 |
| requiresAuth | boolean | 是 | 是否需要登录权限 |
| permissions | string[] | 否 | 路由权限列表，用于细粒度权限控制 |
| showInMenu | boolean | 是 | 是否在菜单中显示 |
| icon | string | 否 | 菜单图标 |
| order | number | 否 | 路由顺序，用于菜单排序 |
| keepAlive | boolean | 否 | 是否缓存路由组件 |
| breadcrumbName | string | 否 | 面包屑自定义名称 |

### 3.2 路由配置示例

```typescript
import { AppRouteObject } from '../types';
import { lazy } from 'react';

// 懒加载组件
const HomePage = lazy(() => import('@/pages/HomePage'));

// 路由配置
export const homeRoute: AppRouteObject = {
  path: '/home',
  name: 'home',
  element: <HomePage />,
  meta: {
    title: '首页',
    requiresAuth: true,
    permissions: ['home:view'],
    showInMenu: true,
    icon: 'home',
    order: 1,
    keepAlive: true,
  },
};
```

## 4. 路由守卫

### 4.1 登录验证守卫（AuthGuard）

用于验证用户是否登录，未登录用户将被重定向到登录页。

### 4.2 权限控制守卫（PermissionGuard）

用于验证用户是否具有访问当前路由的权限，无权限用户将被重定向到403页。

## 5. 路由懒加载

所有路由组件均采用懒加载方式，优化了应用的初始加载性能。

```typescript
// 懒加载组件
const HomePage = lazy(() => import('@/pages/HomePage'));
```

## 6. 路由工具函数

### 6.1 processRoutes

处理路由配置，添加懒加载和守卫。

```typescript
import { processRoutes } from '@/router';

const processedRoutes = processRoutes(routes);
```

### 6.2 mergeRoutes

合并多个路由模块。

```typescript
import { mergeRoutes } from '@/router';

const allRoutes = mergeRoutes(mainRoutes, errorRoutes);
```

### 6.3 findRouteByName

根据路由名称查找路由配置。

```typescript
import { findRouteByName } from '@/router';

const route = findRouteByName(routes, 'home');
```

### 6.4 findRouteByPath

根据路由路径查找路由配置。

```typescript
import { findRouteByPath } from '@/router';

const route = findRouteByPath(routes, '/home');
```

### 6.5 getMenuRoutes

获取所有需要在菜单中显示的路由。

```typescript
import { getMenuRoutes } from '@/router';

const menuRoutes = getMenuRoutes(routes);
```

## 7. 路由跳转

### 7.1 使用 useNavigate 钩子

```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// 跳转到指定路由
navigate('/home');

// 带状态的路由跳转
navigate('/home', { state: { from: '/login' } });

// 返回上一页
navigate(-1);
```

### 7.2 使用 Link 组件

```typescript
import { Link } from 'react-router-dom';

<Link to="/home">首页</Link>

// 带状态的路由跳转
<Link to="/home" state={{ from: '/login' }}>首页</Link>
```

## 8. 添加新路由

### 8.1 在现有模块中添加路由

1. 在对应的路由模块文件中添加路由配置
2. 确保路由配置符合 AppRouteObject 类型
3. 设置正确的路由元信息
4. 使用懒加载方式导入组件

### 8.2 创建新的路由模块

1. 在 `modules` 目录下创建新的路由模块文件
2. 定义路由配置数组
3. 在 `index.tsx` 中导入并合并新的路由模块

## 9. 测试路由系统

### 9.1 路由跳转测试

- 测试正常路由跳转
- 测试带状态的路由跳转
- 测试路由参数传递
- 测试嵌套路由跳转

### 9.2 权限控制测试

- 测试未登录用户访问需要登录的路由
- 测试无权限用户访问需要权限的路由
- 测试有权限用户访问需要权限的路由

### 9.3 异常场景测试

- 测试访问不存在的路由（404）
- 测试服务器错误路由（500）
- 测试路由懒加载失败场景
- 测试路由守卫异常场景

## 10. 最佳实践

1. 路由配置应按功能模块进行组织
2. 每个路由都应设置详细的元信息
3. 所有路由组件都应使用懒加载
4. 合理使用路由守卫进行权限控制
5. 为路由设置统一的命名规范
6. 定期清理不再使用的路由
7. 为路由添加适当的注释

## 11. 版本更新记录

| 版本 | 更新内容 | 更新日期 |
| --- | --- | --- |
| v1.0.0 | 初始化路由系统 | 2026-01-06 |
