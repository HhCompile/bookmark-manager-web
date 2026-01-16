/**
 * TanStack Query配置
 * 统一管理数据获取、缓存、重试等策略
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * 创建Query Client实例
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据缓存时间：5分钟
      staleTime: 5 * 60 * 1000, // 5分钟
      // 重试次数：3次
      retry: 3,
      // 重试延迟：指数退避
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 窗口重新聚焦时重新获取
      refetchOnWindowFocus: false,
    },
    mutations: {
      // 失败时重试
      retry: 1,
    },
  },
});

/**
 * 清除查询缓存
 * @param queryKeys 要清除的查询键
 */
export function clearQueries(queryKeys: string[] | string[]): void {
  queryKeys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
  });
}

/**
 * 清除所有缓存
 */
export function clearAllQueries(): void {
  queryClient.clear();
}

/**
 * 重新获取指定查询
 * @param queryKeys 要重新获取的查询键
 */
export function refetchQueries(queryKeys: string[] | string[]): void {
  queryKeys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: Array.isArray(key) ? key : [key] });
  });
}

export default queryClient;
