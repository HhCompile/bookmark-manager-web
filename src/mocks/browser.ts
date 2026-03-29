/**
 * MSW Browser 配置
 * 在开发环境中启用 Mock Service Worker
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// 启动函数
export function startMockWorker() {
  if (import.meta.env.DEV) {
    return worker.start({
      onUnhandledRequest: 'bypass', // 不拦截未处理的请求
    });
  }
  return Promise.resolve();
}
