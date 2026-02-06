import { useState, useCallback, Suspense, lazy, useEffect } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion, AnimatePresence } from 'motion/react';

// 组件导入
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import HomePage from './pages/home/HomePage';

// 懒加载组件
const BookmarkView = lazy(() => import('./pages/bookmark/BookmarkView'));
const TagCloudVisualization = lazy(
  () => import('./common/TagCloudVisualization')
);
const QualityMonitor = lazy(() => import('./common/QualityMonitor'));
const PrivateVault = lazy(() => import('./pages/bookmark/PrivateVault'));
const AIConfirmationPanel = lazy(() => import('./common/AIConfirmationPanel'));
const SyncProgress = lazy(() => import('./common/SyncProgress'));
const ReaderSidebar = lazy(() => import('./layout/ReaderSidebar'));
const TaskManagerPanel = lazy(() => import('./common/TaskManagerPanel'));

// 工具导入
import { initAnalytics, trackPageView, trackEvent } from './utils/analytics';

// 上下文导入
import { BookmarkProvider } from './contexts/BookmarkContext';
import { useBookmarks } from './contexts/BookmarkContext';

// 钩子导入
import { useChromeBookmarks } from './hooks/useChromeBookmarks';

// 类型定义
type TabType = 'home' | 'bookmarks' | 'analytics' | 'quality' | 'private';

function AppContent() {
  // 状态管理
  const [showSyncProgress, setShowSyncProgress] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showReader, setShowReader] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // 书签数据
  const { bookmarks } = useBookmarks();

  console.log('bookmarks:', bookmarks);

  // Chrome 书签同步
  const {
    bookmarks: chromeBookmarks,
    refreshBookmarks: refreshChromeBookmarks,
    isLoading: isSyncing,
    error: syncError,
  } = useChromeBookmarks();

  console.log('refreshChromeBookmarks:', refreshChromeBookmarks);

  // 初始化Google Analytics
  useEffect(() => {
    initAnalytics();
  }, []);

  // 跟踪页面浏览
  useEffect(() => {
    const pageTitleMap: Record<TabType, string> = {
      home: '首页',
      bookmarks: '书签管理',
      analytics: '数据分析',
      quality: '质量监控',
      private: '隐私空间',
    };

    const pagePath = `/${activeTab}`;
    const pageTitle = pageTitleMap[activeTab];

    trackPageView(pagePath, pageTitle);

    // 跟踪用户交互事件
    trackEvent('navigation', 'tab_change', activeTab);
  }, [activeTab]);

  // 优化回调函数，避免不必要的重新渲染
  const handleFileUpload = useCallback(() => {
    // 文件上传后，自动显示 AI 优化面板
    setShowAIPanel(true);
  }, []);

  // 处理同步操作
  const handleSync = useCallback(async () => {
    setShowSyncProgress(true);

    try {
      // 调用 Chrome 书签同步方法
      await refreshChromeBookmarks();

      // 打印同步结果
      console.log('Chrome 书签同步结果:', {
        bookmarks: chromeBookmarks,
        isLoading: isSyncing,
        error: syncError,
        bookmarkCount: chromeBookmarks.length,
        hasBookmarks: chromeBookmarks.length > 0,
      });

      // 同步完成后，自动显示 AI 优化面板
      setTimeout(() => {
        setShowSyncProgress(false);
        setShowAIPanel(true);
      }, 1000);
    } catch (error) {
      console.error('同步失败:', error);

      // 同步失败后，仍然关闭同步进度面板
      setTimeout(() => {
        setShowSyncProgress(false);
      }, 1000);
    }
  }, [refreshChromeBookmarks, chromeBookmarks, isSyncing, syncError]);

  // 处理标签切换
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  // 渲染标签导航
  const renderTabNavigation = () => {
    if (activeTab === 'home') return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 px-6"
      >
        <nav className="flex gap-6">
          <button
            onClick={() => handleTabChange('home')}
            className="px-4 py-3 border-b-2 border-transparent text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="返回首页"
          >
            🏠 返回首页
          </button>
          <button
            onClick={() => handleTabChange('bookmarks')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'bookmarks'
                ? 'border-blue-600 text-blue-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            aria-label="书签管理"
          >
            📚 书签管理
          </button>
          <button
            onClick={() => handleTabChange('analytics')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            aria-label="数据分析"
          >
            📊 数据分析
          </button>
          <button
            onClick={() => handleTabChange('quality')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'quality'
                ? 'border-blue-600 text-blue-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            aria-label="质量监控"
          >
            🔍 质量监控
          </button>
          <button
            onClick={() => handleTabChange('private')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'private'
                ? 'border-blue-600 text-blue-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
            aria-label="隐私空间"
          >
            🔒 隐私空间
          </button>
        </nav>
      </motion.div>
    );
  };

  // 渲染标签内容
  const renderTabContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {(() => {
            switch (activeTab) {
              case 'home':
                return (
                  <HomePage
                    onNavigate={(tab) => handleTabChange(tab as TabType)}
                    onSync={handleSync}
                    onAIOptimize={() => setShowAIPanel(true)}
                    onFileUpload={handleFileUpload}
                  />
                );
              case 'bookmarks':
                return (
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">加载中...</div>
                      </div>
                    }
                  >
                    <BookmarkView />
                  </Suspense>
                );
              case 'analytics':
                return (
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">加载中...</div>
                      </div>
                    }
                  >
                    <TagCloudVisualization bookmarks={bookmarks} />
                  </Suspense>
                );
              case 'quality':
                return (
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">加载中...</div>
                      </div>
                    }
                  >
                    <QualityMonitor bookmarks={bookmarks} />
                  </Suspense>
                );
              case 'private':
                return (
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">加载中...</div>
                      </div>
                    }
                  >
                    <PrivateVault onUnlock={() => console.log('Unlocked')} />
                  </Suspense>
                );
              default:
                return null;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-full flex flex-col bg-gray-50">
      {/* 头部导航 */}
      <Header
        onSync={handleSync}
        onAIOptimize={() => setShowAIPanel(true)}
        onLogoClick={() => handleTabChange('home')}
        onFileUpload={handleFileUpload}
        onTaskManager={() => setShowTaskManager(true)}
      />

      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 侧边栏 - 只在非首页时显示 */}
        <AnimatePresence>
          {activeTab !== 'home' && (
            <Sidebar
              onNavigate={(tab) =>
                handleTabChange(
                  tab as
                    | 'home'
                    | 'bookmarks'
                    | 'analytics'
                    | 'quality'
                    | 'private'
                )
              }
            />
          )}
        </AnimatePresence>

        {/* 主要内容 */}
        <main className="flex-1 overflow-auto">
          {/* 标签导航 */}
          {renderTabNavigation()}

          {/* 标签内容 */}
          <div className={activeTab !== 'home' ? 'p-6' : ''}>
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* 模态面板 */}
      <AnimatePresence>
        {showSyncProgress && (
          <Suspense fallback={null}>
            <SyncProgress onClose={() => setShowSyncProgress(false)} />
          </Suspense>
        )}
        {showAIPanel && (
          <Suspense fallback={null}>
            <AIConfirmationPanel onClose={() => setShowAIPanel(false)} />
          </Suspense>
        )}
        {showReader && (
          <Suspense fallback={null}>
            <ReaderSidebar
              url="https://example.com/article"
              title="React 性能优化指南"
              onClose={() => setShowReader(false)}
            />
          </Suspense>
        )}
        {showTaskManager && (
          <Suspense fallback={null}>
            <TaskManagerPanel onClose={() => setShowTaskManager(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BookmarkProvider>
      <Tooltip.Provider>
        <AppContent />
      </Tooltip.Provider>
    </BookmarkProvider>
  );
}
