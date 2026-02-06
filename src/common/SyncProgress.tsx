import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SyncProgressProps {
  onClose: () => void;
}

export default function SyncProgress({ onClose }: SyncProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentItem, setCurrentItem] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const items = [
      '正在连接 Chrome...',
      '正在抓取书签 (12/150)...',
      '正在抓取书签 (45/150)...',
      '正在抓取书签 (89/150)...',
      '正在抓取书签 (120/150)...',
      '正在抓取书签 (150/150)...',
      'AI 预处理中...',
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
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    }, 500);

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
              {isComplete ? '同步完成' : 'Chrome 书签同步'}
            </h3>
            {!isComplete && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {isComplete ? (
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
