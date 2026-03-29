import { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import * as Tooltip from '@radix-ui/react-tooltip';

// 布局组件
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';

// 页面组件
import HomePage from './pages/home/HomePage';

// 懒加载组件
const BookmarkView = lazy(() => import('./pages/bookmark/BookmarkView'));
const TagCloudVisualization = lazy(() => import('./common/TagCloudVisualization'));
const QualityMonitor = lazy(() => import('./common/QualityMonitor'));
const PrivateVault = lazy(() => import('./pages/bookmark/PrivateVault'));
const AIConfirmationPanel = lazy(() => import('./common/AIConfirmationPanel'));
const SyncProgress = lazy(() => import('./common/SyncProgress'));
const TaskManagerPanel = lazy(() => import('./common/TaskManagerPanel'));

// 加载中组件
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-pulse text-gray-500">加载中...</div>
  </div>
);

function AppContent() {
  const [showSyncProgress, setShowSyncProgress] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);

  const handleSync = () => {
    setShowSyncProgress(true);
  };

  const handleAIOptimize = () => {
    setShowAIPanel(true);
  };

  const headerProps = {
    onSync: handleSync,
    onAIOptimize: handleAIOptimize,
    onTaskManager: () => setShowTaskManager(true),
  };

  return (
    <div className="min-h-full flex flex-col bg-gray-50">
      <BrowserRouter>
        <Routes>
          {/* 首页 - 无侧边栏 */}
          <Route
            path="/"
            element={
              <>
                <Header {...headerProps} />
                <main className="flex-1 overflow-auto">
                  <HomePage />
                </main>
              </>
            }
          />
          
          {/* 功能页面 - 带侧边栏 */}
          <Route
            path="/app/*"
            element={
              <>
                <Header {...headerProps} />
                <div className="flex-1 flex overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 overflow-auto p-6">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="bookmarks" element={<BookmarkView />} />
                        <Route path="analytics" element={<TagCloudVisualization bookmarks={[]} />} />
                        <Route path="quality" element={<QualityMonitor bookmarks={[]} />} />
                        <Route path="private" element={<PrivateVault onUnlock={() => {}} />} />
                        <Route path="*" element={<Navigate to="/app/bookmarks" replace />} />
                      </Routes>
                    </Suspense>
                  </main>
                </div>
              </>
            }
          />
          
          {/* 404 重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

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
          {showTaskManager && (
            <Suspense fallback={null}>
              <TaskManagerPanel onClose={() => setShowTaskManager(false)} />
            </Suspense>
          )}
        </AnimatePresence>
      </BrowserRouter>
    </div>
  );
}

export default function App() {
  return (
    <Tooltip.Provider>
      <AppContent />
    </Tooltip.Provider>
  );
}
