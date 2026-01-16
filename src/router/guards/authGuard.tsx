import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * 模拟获取当前用户信息
 * 实际项目中应从状态管理或API获取
 */
const getCurrentUser = () => {
  // 这里可以从localStorage、sessionStorage或状态管理中获取用户信息
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * 登录验证守卫
 * @param children 子组件
 */
export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 获取当前路由的元信息
    const routeMeta = (location.state as any)?.routeMeta;
    
    // 如果路由需要登录权限，则检查用户是否登录
    if (routeMeta?.requiresAuth) {
      const user = getCurrentUser();
      
      if (!user || !user.isLoggedIn) {
        // 用户未登录，重定向到登录页，并保存当前位置以便登录后返回
        navigate('/login', {
          state: { from: location.pathname },
        });
        return;
      }
    }
  }, [location, navigate]);

  return <>{children}</>;
};

/**
 * 权限控制守卫
 * @param children 子组件
 */
export const PermissionGuard = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 获取当前路由的元信息
    const routeMeta = (location.state as any)?.routeMeta;
    
    // 如果路由有权限要求，则检查用户是否有相应权限
    if (routeMeta?.permissions && routeMeta.permissions.length > 0) {
      const user = getCurrentUser();
      
      if (!user) {
        // 用户未登录，重定向到登录页
        navigate('/login');
        return;
      }
      
      // 检查用户是否拥有路由所需的所有权限
      const hasPermission = routeMeta.permissions.every((permission: string) => {
        return user.permissions.some((userPerm: any) => userPerm.id === permission);
      });
      
      if (!hasPermission) {
        // 用户没有权限，重定向到无权限页面
        navigate('/403');
      }
    }
  }, [location, navigate]);

  return <>{children}</>;
};
