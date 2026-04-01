/**
 * 受保护路由组件
 * 未登录用户将被重定向到登录页面
 */

import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/Layout/Header';
import Sidebar from '@/Layout/Sidebar';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
  layout?: 'default' | 'full' | 'none';
}

// 加载中状态组件
function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-500">加载中...</p>
      </motion.div>
    </div>
  );
}

// 默认布局（带侧边栏）
function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// 仅头部布局
function FullLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  layout = 'default',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 显示加载状态
  if (isLoading) {
    return <AuthLoading />;
  }

  // 需要认证但未登录，重定向到登录页
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: { pathname: location.pathname } }}
        replace
      />
    );
  }

  // 已登录用户访问登录/注册页，重定向到首页
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/app/bookmarks" replace />;
  }

  // 渲染内容
  const content = children || <Outlet />;

  // 根据布局类型包裹内容
  switch (layout) {
    case 'default':
      return <DefaultLayout>{content}</DefaultLayout>;
    case 'full':
      return <FullLayout>{content}</FullLayout>;
    case 'none':
    default:
      return <>{content}</>;
  }
}

// 公开路由（登录/注册页面，已登录用户自动跳转）
export function PublicRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth={false} layout="none">
      {children}
    </ProtectedRoute>
  );
}

// 认证路由（需要登录）
export function AuthRoute({ 
  children,
  layout = 'default' 
}: { 
  children: React.ReactNode;
  layout?: 'default' | 'full';
}) {
  return (
    <ProtectedRoute requireAuth layout={layout}>
      {children}
    </ProtectedRoute>
  );
}
