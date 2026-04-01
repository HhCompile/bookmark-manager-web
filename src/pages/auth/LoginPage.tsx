/**
 * 登录页面
 */

import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Loader2,
  Bookmark
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // 获取重定向地址
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app/bookmarks';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      return;
    }

    try {
      await login({ email, password, rememberMe });
      navigate(from, { replace: true });
    } catch {
      // 错误已在 AuthContext 中设置
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('password123');
    clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg mb-4"
          >
            <Bookmark className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900">欢迎回来</h1>
          <p className="text-gray-500 mt-1">登录您的书签管理账户</p>
        </div>

        {/* 登录表单 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 邮箱输入 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="email">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="输入您的密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 记住我和忘记密码 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  记住我
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-violet-600 hover:text-violet-700 transition-colors"
              >
                忘记密码？
              </Link>
            </div>

            {/* 登录按钮 */}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  登录中...
                </>
              ) : (
                <>
                  登录
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* 演示账户 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center mb-2">
              测试账户: <code className="bg-gray-200 px-1 rounded">demo@example.com</code> / 
              <code className="bg-gray-200 px-1 rounded">password123</code>
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={fillDemoCredentials}
              disabled={isLoading}
            >
              填充演示账户
            </Button>
          </div>

          {/* 注册链接 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              还没有账户？{' '}
              <Link
                to="/register"
                className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
              >
                立即注册
              </Link>
            </p>
          </div>
        </motion.div>

        {/* 返回首页 */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
