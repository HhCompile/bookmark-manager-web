/**
 * 认证上下文 - 管理用户登录状态和认证信息
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

// 用户类型定义
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// 登录凭证
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 注册信息
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// 认证上下文类型
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  error: string | null;
  clearError: () => void;
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const REMEMBER_KEY = 'auth_remember';

// 模拟用户数据（用于演示）
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'demo@example.com': {
    user: {
      id: '1',
      email: 'demo@example.com',
      name: '演示用户',
      role: 'user',
      createdAt: new Date().toISOString(),
    },
    password: 'password123',
  },
};

// Provider 组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化：从 localStorage/sessionStorage 恢复登录状态
  useEffect(() => {
    const initAuth = () => {
      try {
        const rememberMe = localStorage.getItem(REMEMBER_KEY) === 'true';
        const storage = rememberMe ? localStorage : sessionStorage;
        
        const storedUser = storage.getItem(USER_KEY);
        const token = storage.getItem(TOKEN_KEY);

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Failed to restore auth state:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 登录
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 模拟登录验证
      const mockUser = MOCK_USERS[credentials.email];
      
      if (!mockUser || mockUser.password !== credentials.password) {
        throw new Error('邮箱或密码错误');
      }

      const { user: userData } = mockUser;
      const token = `mock_token_${Date.now()}`;

      // 存储到相应的 storage
      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, token);
      storage.setItem(USER_KEY, JSON.stringify(userData));
      
      if (credentials.rememberMe) {
        localStorage.setItem(REMEMBER_KEY, 'true');
      }

      setUser(userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 注册
  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 验证邮箱是否已存在
      if (MOCK_USERS[credentials.email]) {
        throw new Error('该邮箱已被注册');
      }

      // 创建新用户
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        name: credentials.name,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      // 存储到 mock 数据库
      MOCK_USERS[credentials.email] = {
        user: newUser,
        password: credentials.password,
      };

      // 自动登录
      const token = `mock_token_${Date.now()}`;
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(newUser));

      setUser(newUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : '注册失败';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 登出
  const logout = useCallback(() => {
    // 清除所有存储
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    
    setUser(null);
    setError(null);
  }, []);

  // 更新用户信息
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      
      // 同步更新 storage
      const rememberMe = localStorage.getItem(REMEMBER_KEY) === 'true';
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(USER_KEY, JSON.stringify(updated));
      
      return updated;
    });
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 高阶组件：需要认证的组件包装器
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
