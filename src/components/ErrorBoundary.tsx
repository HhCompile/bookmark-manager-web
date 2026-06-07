/**
 * 错误边界组件
 * 捕获子组件的错误，显示友好的错误提示，防止整个应用崩溃
 * 
 * 使用示例:
 * <ErrorBoundary fallback={<ErrorPage />}>
 *   <App />
 * </ErrorBoundary>
 */

import React, { Component, ErrorInfo, ReactNode, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // 当 resetKeys 变化时重置错误状态
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index])
    ) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // 如果有自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              出错了
            </h2>
            <p className="text-gray-600 mb-4">
              应用遇到了一些问题，请尝试刷新页面。
            </p>
            <div className="bg-gray-100 rounded-lg p-3 mb-4 text-left">
              <p className="text-sm text-gray-700 font-mono break-all">
                {this.state.error?.message}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.reset}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                重试
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                刷新页面
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <ErrorDetails 
                error={this.state.error} 
                errorInfo={this.state.errorInfo} 
              />
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 使用 ErrorBoundary 的 Hook 版本
 * 用于函数组件中捕获异步错误
 * 
 * 使用示例:
 * const { ErrorBoundaryWrapper, error, resetError } = useErrorBoundary();
 * 
 * return (
 *   <ErrorBoundaryWrapper>
 *     <MyComponent />
 *   </ErrorBoundaryWrapper>
 * );
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const ErrorBoundaryWrapper = React.useCallback(
    ({ children }: { children: ReactNode }) => (
      <ErrorBoundary
        fallback={
          error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error.message}</p>
              <button
                onClick={resetError}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                重试
              </button>
            </div>
          ) : undefined
        }
        onError={(err) => setError(err)}
      >
        {children}
      </ErrorBoundary>
    ),
    [error, resetError]
  );

  return { ErrorBoundaryWrapper, error, resetError };
}

// 错误详情组件（带复制功能）
interface ErrorDetailsProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

function ErrorDetails({ error, errorInfo }: ErrorDetailsProps) {
  const [copied, setCopied] = useState(false);

  const getErrorText = () => {
    return `Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace'}
Component Stack: ${errorInfo?.componentStack || 'No component stack'}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getErrorText());
      setCopied(true);
      toast.success('错误信息已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('复制失败，请手动复制');
    }
  };

  return (
    <details className="mt-4 text-left">
      <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
        查看详细错误信息
      </summary>
      <div className="mt-2 relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors z-10"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              已复制
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              复制
            </>
          )}
        </button>
        <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-auto max-h-60 pt-10">
          {error?.message && (
            <div className="text-red-400 font-semibold mb-2">
              Error: {error.message}
            </div>
          )}
          {error?.stack && (
            <div className="text-gray-400 mb-2">
              {error.stack}
            </div>
          )}
          {errorInfo?.componentStack && (
            <div className="text-gray-500 border-t border-gray-700 pt-2 mt-2">
              {errorInfo.componentStack}
            </div>
          )}
        </pre>
      </div>
    </details>
  );
}

export default ErrorBoundary;
