import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.tsx';
import './styles/index.css';
import './locales'; // 初始化 i18n
import { initOfflineSupport } from './utils/serviceWorker';

// 创建 Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分钟
      refetchOnWindowFocus: false,
      // 离线时重试策略
      retry: (failureCount) => {
        // 离线时不重试
        if (!navigator.onLine) return false;
        // 最多重试 3 次
        return failureCount < 3;
      },
    },
  },
});

// 启动 Mock Service Worker（开发环境）
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
  return Promise.resolve();
}

// 初始化应用
async function initApp() {
  // 启用 Mock
  await enableMocking();

  // 注册 Service Worker（生产环境）
  if (import.meta.env.PROD) {
    initOfflineSupport({
      onSuccess: () => {
        console.log('[App] App is ready for offline use');
      },
      onOffline: () => {
        // 可以在这里显示离线提示
        console.log('[App] You are offline');
      },
      onOnline: () => {
        // 可以在这里显示在线提示
        console.log('[App] You are back online');
        // 重新获取数据
        queryClient.invalidateQueries();
      },
    });
  }

  // 渲染应用
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <App />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

initApp();
