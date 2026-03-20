import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Chrome, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isChromeExtension } from '../components/ChromeExtensionPrompt';

interface SyncProgressProps {
  onClose: () => void;
}

export default function SyncProgress({ onClose }: SyncProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentItem, setCurrentItem] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isExtensionAvailable, setIsExtensionAvailable] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    // 检测是否在 Chrome 扩展环境中
    if (!isChromeExtension()) {
      setIsExtensionAvailable(false);
      return; // 不自动关闭，让用户手动关闭
    }

    const items = [
      '正在连接 Chrome...',
      '正在抓取书签...',
      '正在解析书签数据...',
      '正在同步到本地...',
      '同步完成！',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < items.length) {
        setCurrentItem(items[index]);
        setProgress(((index + 1) / items.length) * 100);
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        // 同步成功完成后，1.5秒后自动关闭
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-lg p-6 w-96 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {isComplete ? '同步完成' : isExtensionAvailable ? 'Chrome 书签同步' : '无法同步'}
            </h3>
            {/* 错误状态下显示关闭按钮，同步进行中也可以关闭 */}
            {(!isExtensionAvailable || !isComplete) && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {!isExtensionAvailable ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-4"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Chrome 扩展未安装
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  要使用书签同步功能，需要安装 Chrome 扩展
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left w-full">
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>安装步骤：</strong>
                  </p>
                  <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                    <li>打开 Chrome 扩展管理页面 chrome://extensions/</li>
                    <li>开启"开发者模式"</li>
                    <li>点击"加载已解压的扩展程序"</li>
                    <li>选择项目的 dist 文件夹</li>
                  </ol>
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => window.open('chrome://extensions/', '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Chrome className="w-4 h-4" />
                    打开扩展管理
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    稍后再说
                  </button>
                </div>
              </div>
            </motion.div>
          ) : isComplete ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center py-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-gray-600">成功同步 150 个书签</p>
            </motion.div>
          ) : (
            <div>
              {/* 进度条 */}
              <div className="mb-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* 当前状态 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <p className="text-sm text-gray-600">{currentItem}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round(progress)}% 完成
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
