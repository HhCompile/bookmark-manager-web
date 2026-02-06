import { Lock, Unlock, Eye, EyeOff, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface PrivateVaultProps {
  onUnlock: (password: string) => void;
}

export default function PrivateVault({ onUnlock }: PrivateVaultProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [error, setError] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();

    // 模拟密码验证
    if (password === 'demo') {
      setIsLocked(false);
      onUnlock(password);
      setError('');
    } else {
      setError('密码错误，请重试（提示：输入 "demo"）');
    }
  };

  const handleLock = () => {
    setIsLocked(true);
    setPassword('');
  };

  if (!isLocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Unlock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">私密学习库</h3>
              <p className="text-sm opacity-90">已解锁，内容可见</p>
            </div>
          </div>
          <button
            onClick={handleLock}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <Lock className="w-4 h-4" />
            锁定
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5" />
            <span className="font-medium">加密状态</span>
          </div>
          <div className="space-y-2 text-sm opacity-90">
            <p>✓ 内容已使用 AES-256 加密</p>
            <p>✓ 密码保存在本地浏览器</p>
            <p>✓ 关闭窗口自动锁定</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg border-2 border-purple-200 p-6"
      >
        <div className="flex flex-col items-center">
          {/* 锁定图标 */}
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 p-6 bg-purple-100 rounded-full"
          >
            <Lock className="w-12 h-12 text-purple-600" />
          </motion.div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            私密学习库
          </h3>
          <p className="text-sm text-gray-600 mb-6 text-center">
            此分组已加密保护
            <br />
            请输入密码以查看内容
          </p>

          {/* 密码输入表单 */}
          <form onSubmit={handleUnlock} className="w-full max-w-sm">
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="输入密码"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <Unlock className="w-5 h-5" />
              解锁访问
            </button>
          </form>

          {/* 提示信息 */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg w-full max-w-sm">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Shield className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900 mb-1">安全提示</p>
                <ul className="space-y-1 text-xs">
                  <li>• 支持指纹/Face ID 生物识别</li>
                  <li>• 内容在数据库中加密存储</li>
                  <li>• 离开页面自动锁定保护</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
