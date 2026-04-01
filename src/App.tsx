import { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import * as Tooltip from '@radix-ui/react-tooltip';

// Providers
import { AuthProvider } from './contexts/AuthContext';
import { BookmarkProvider } from './contexts/BookmarkContext';

// 布局组件
import Header from './Layout/Header';
import Sidebar from './Layout/Sidebar';

// 页面组件
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

// 懒加载组件
const BookmarkView = lazy(() => import('./pages/bookmark/BookmarkView'));
const TagCloudVisualization = lazy(() => import('./common/TagCloudVisualization'));
const QualityMonitor = lazy(() => import('./common/QualityMonitor'));
const PrivateVault = lazy(() => import('./pages/bookmark/PrivateVault'));
const SyncProgress = lazy(() => import('./common/SyncProgress'));
const TaskManagerPanel = lazy(() => import('./common/TaskManagerPanel'));
const AIConfirmationPanel = lazy(() => import('./common/AIConfirmationPanel'));

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
          
          {/* 登录页面 - 公开访问 */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false} layout="none">
                <LoginPage />
              </ProtectedRoute>
            }
          />
          
          {/* 注册页面 - 公开访问 */}
          <Route
            path="/register"
            element={
              <ProtectedRoute requireAuth={false} layout="none">
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          
          {/* 功能页面 - 需要登录 */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute requireAuth layout="none">
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
                          <Route path="private" element={<PrivateVault onUnlock={() => {/* TODO: 实现解锁逻辑 */}} />} />
                          <Route path="*" element={<Navigate to="/app/bookmarks" replace />} />
                        </Routes>
                      </Suspense>
                    </main>
                  </div>
                </>
              </ProtectedRoute>
            }
          />
          
          {/* 404 重定向 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* 模态面板 - 只在登录后显示 */}
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
      <AuthProvider>
        <BookmarkProvider>
          <AppContent />
        </BookmarkProvider>
      </AuthProvider>
    </Tooltip.Provider>
  );
}
