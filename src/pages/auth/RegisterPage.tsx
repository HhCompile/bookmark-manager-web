/**
 * 注册页面
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Loader2,
  Bookmark,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 密码强度检查
  const getPasswordStrength = (pwd: string): { strength: number; label: string } => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    const labels = ['太弱', '弱', '中等', '强', '非常强'];
    return { strength, label: labels[strength] };
  };

  const passwordStrength = getPasswordStrength(password);

  const validateForm = (): boolean => {
    setValidationError(null);

    if (!name.trim()) {
      setValidationError('请输入姓名');
      return false;
    }

    if (name.length < 2) {
      setValidationError('姓名至少需要2个字符');
      return false;
    }

    if (!email.trim()) {
      setValidationError('请输入邮箱地址');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('请输入有效的邮箱地址');
      return false;
    }

    if (password.length < 8) {
      setValidationError('密码至少需要8个字符');
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError('两次输入的密码不一致');
      return false;
    }

    if (!agreeTerms) {
      setValidationError('请同意服务条款和隐私政策');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await register({ name, email, password, confirmPassword });
      navigate('/app/bookmarks', { replace: true });
    } catch {
      // 错误已在 AuthContext 中设置
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
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
          <h1 className="text-2xl font-bold text-gray-900">创建账户</h1>
          <p className="text-gray-500 mt-1">开始管理您的书签收藏</p>
        </div>

        {/* 注册表单 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {(error || validationError) && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error || validationError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 姓名输入 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="name">
                姓名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="您的姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

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
                  placeholder="创建密码（至少8位）"
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
              
              {/* 密码强度指示器 */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength.strength
                              ? passwordStrength.strength <= 2
                                ? 'bg-red-500'
                                : passwordStrength.strength === 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {passwordStrength.label}
                    </span>
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-600' : ''}`}>
                      <CheckCircle2 className={`w-3 h-3 ${password.length >= 8 ? 'opacity-100' : 'opacity-40'}`} />
                      至少8个字符
                    </li>
                    <li className={`flex items-center gap-1 ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                      <CheckCircle2 className={`w-3 h-3 ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'opacity-100' : 'opacity-40'}`} />
                      大小写字母
                    </li>
                    <li className={`flex items-center gap-1 ${/\d/.test(password) ? 'text-green-600' : ''}`}>
                      <CheckCircle2 className={`w-3 h-3 ${/\d/.test(password) ? 'opacity-100' : 'opacity-40'}`} />
                      至少一个数字
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* 确认密码 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 同意条款 */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                disabled={isLoading}
                className="mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 cursor-pointer"
              >
                我已阅读并同意{' '}
                <Link to="/terms" className="text-violet-600 hover:underline">
                  服务条款
                </Link>
                {' '}和{' '}
                <Link to="/privacy" className="text-violet-600 hover:underline">
                  隐私政策
                </Link>
              </label>
            </div>

            {/* 注册按钮 */}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  注册中...
                </>
              ) : (
                <>
                  创建账户
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* 登录链接 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              已有账户？{' '}
              <Link
                to="/login"
                className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
              >
                立即登录
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
