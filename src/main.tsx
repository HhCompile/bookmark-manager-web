import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import i18nInstance from './i18n';
import App from './App';
import './styles/index.css';

// 导入工具管理器和工具
import { toolManager } from './services/toolManager';
import { tools } from './services/tools';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5分钟
      retry: 1,
    },
  },
});

// 注册所有工具
toolManager.registerTools(tools);
console.log(
  '工具注册完成:',
  toolManager.getAvailableTools().map(tool => tool.name)
);

// 初始化配置驱动的工具调用流程
import { coreExecutor } from './services/coreExecutor';
import { appConfig } from './config';
console.log('应用配置加载完成:', {
  environment: appConfig.environment,
  tools: appConfig.tools.map(tool => ({
    id: tool.id,
    enabled: tool.enabled,
    priority: tool.priority,
  })),
  featureFlags: appConfig.featureFlags,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18nInstance}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </I18nextProvider>
  </StrictMode>
);
