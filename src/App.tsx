// 导入核心依赖
import React, { ErrorInfo, Suspense } from 'react';

// 导入路由相关组件
import { RouterProvider } from 'react-router-dom';

// 导入UI组件
import { Toaster } from '@/components/ui/sonner';

// 导入配置
import router from './router';

// 导入全局样式
import './styles/index.css';

/**
 * 全局错误边界组件
 * 用于捕获和处理应用中的JavaScript错误
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // 更新状态，下次渲染时显示错误UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 可以在此处记录错误信息到日志服务
    console.error('应用全局错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 自定义错误UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold text-error mb-4">应用发生错误</h1>
            <p className="text-text-secondary mb-8">
              抱歉，应用发生了意外错误。请刷新页面重试或联系管理员。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 应用根组件
 * 包含路由配置和整体布局结构
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <h2 className="text-xl font-semibold text-text-primary">
                应用加载中...
              </h2>
            </div>
          </div>
        }
      >
        <div className="App min-h-screen flex flex-col bg-background">
          {/* 路由配置 */}
          <RouterProvider router={router} />

          {/* 全局通知组件 */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            expand={true}
            duration={3000}
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
