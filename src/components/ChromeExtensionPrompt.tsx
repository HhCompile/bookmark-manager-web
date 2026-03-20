import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Chrome, 
  X, 
  Download, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface ChromeExtensionPromptProps {
  onDismiss?: () => void;
}

// 检测是否在 Chrome 浏览器中
const isChromeBrowser = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isChrome = /chrome/.test(userAgent) && /google inc/.test(navigator.vendor.toLowerCase());
  const isEdge = /edg/.test(userAgent); // Edge 也基于 Chromium，但有自己的扩展商店
  return isChrome && !isEdge;
};

// 检测是否在 Chrome 扩展环境中
const isChromeExtension = (): boolean => {
  return typeof chrome !== 'undefined' && 
         chrome.runtime !== undefined && 
         chrome.runtime.id !== undefined;
};

// 检测是否在本地开发环境
const isLocalDevelopment = (): boolean => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
};

export default function ChromeExtensionPrompt({ onDismiss }: ChromeExtensionPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [installStep, setInstallStep] = useState(0);
  const [showDevMode, setShowDevMode] = useState(false);

  useEffect(() => {
    // 延迟检测，避免页面加载时的闪烁
    const timer = setTimeout(() => {
      // 如果不在 Chrome 扩展环境中，且用户之前没有关闭提示
      if (!isChromeExtension()) {
        const dismissed = localStorage.getItem('chrome-extension-prompt-dismissed');
        const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
        const oneDay = 24 * 60 * 60 * 1000;
        
        // 如果超过24小时没有提示，或者从未提示过
        if (!dismissedTime || Date.now() - dismissedTime > oneDay) {
          setIsVisible(true);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('chrome-extension-prompt-dismissed', Date.now().toString());
    onDismiss?.();
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  // 在 Chrome 扩展环境中 - 显示已安装提示
  if (isChromeExtension()) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Chrome 扩展已启用
          </span>
          <span className="text-xs text-green-600">
            书签同步功能可用
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleDismiss();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Chrome className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    安装 Chrome 扩展
                  </h3>
                  <p className="text-sm text-blue-100">
                    解锁完整的书签管理功能
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!isExpanded ? (
                <>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <RefreshCw className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        同步 Chrome 书签
                      </h4>
                      <p className="text-sm text-gray-600">
                        一键同步浏览器中的所有书签，自动分类整理
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <Download className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        快速导入导出
                      </h4>
                      <p className="text-sm text-gray-600">
                        支持 HTML 书签文件导入，轻松迁移数据
                      </p>
                    </div>
                  </div>

                  {!isChromeBrowser() && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          检测到您未使用 Chrome 浏览器
                        </p>
                        <p className="text-xs text-amber-600 mt-1">
                          Chrome 扩展功能需要 Google Chrome 浏览器才能使用
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {isChromeBrowser() ? (
                      <>
                        <button
                          onClick={handleExpand}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          立即安装
                        </button>
                        {isLocalDevelopment() && (
                          <button
                            onClick={() => setShowDevMode(true)}
                            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            开发者模式
                          </button>
                        )}
                      </>
                    ) : (
                      <a
                        href="https://www.google.com/chrome/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        下载 Chrome
                      </a>
                    )}
                    <button
                      onClick={handleDismiss}
                      className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      稍后再说
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* 安装步骤 */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${installStep >= 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        1
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">下载扩展文件</h5>
                        <p className="text-sm text-gray-600 mb-2">
                          从 GitHub Releases 下载最新版本的扩展
                        </p>
                        <a
                          href="https://github.com/your-repo/bookmark-manager-extension/releases"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          前往下载 <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${installStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        2
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">解压文件</h5>
                        <p className="text-sm text-gray-600">
                          将下载的 ZIP 文件解压到任意文件夹
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${installStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        3
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">加载扩展</h5>
                        <p className="text-sm text-gray-600 mb-2">
                          打开 Chrome 扩展管理页面，开启"开发者模式"，点击"加载已解压的扩展程序"
                        </p>
                        <button
                          onClick={() => window.open('chrome://extensions/', '_blank')}
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          打开扩展管理 <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-xs text-gray-600">
                      <strong>提示：</strong> 安装完成后，刷新本页面即可自动识别并使用扩展功能。
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      返回
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      知道了
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* 开发者模式弹窗 */}
          {showDevMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute bg-white rounded-xl shadow-2xl p-6 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="font-semibold text-gray-900 mb-4">开发者模式安装</h4>
              <div className="space-y-3 text-sm text-gray-600 mb-4">
                <p>1. 构建项目：<code className="bg-gray-100 px-1 rounded">pnpm run build</code></p>
                <p>2. 打开 <code className="bg-gray-100 px-1 rounded">chrome://extensions/</code></p>
                <p>3. 开启"开发者模式"</p>
                <p>4. 点击"加载已解压的扩展程序"</p>
                <p>5. 选择项目的 <code className="bg-gray-100 px-1 rounded">dist</code> 文件夹</p>
              </div>
              <button
                onClick={() => setShowDevMode(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 导出检测函数供其他地方使用
export { isChromeExtension, isChromeBrowser, isLocalDevelopment };
