/**
 * API 客户端配置
 * 统一处理请求、响应、错误处理
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_TIMEOUT = 30000;

// 请求配置类型
interface RequestConfig extends RequestInit {
  timeout?: number;
  params?: Record<string, string | number | boolean>;
}

// API 响应类型
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

// API 错误类型
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 构建完整 URL
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(endpoint, window.location.origin);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString().replace(window.location.origin, API_BASE_URL);
}

// 通用请求方法
async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { timeout = API_TIMEOUT, params, ...fetchConfig } = config;
  
  const url = buildUrl(endpoint, params);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers: {
        'Content-Type': 'application/json',
        ...fetchConfig.headers,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw new ApiError(error.message, 500);
    }
    
    throw new ApiError('Unknown error', 500);
  }
}

// HTTP 方法封装
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),
    
  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};

// React Query Hooks 封装
export function useApiQuery<T>(
  key: string[],
  endpoint: string,
  config?: RequestConfig,
  options?: Parameters<typeof useQuery>[2]
) {
  return useQuery<ApiResponse<T>, ApiError>({
    queryKey: key,
    queryFn: () => request<T>(endpoint, config),
    ...options,
  });
}

export function useApiMutation<T, D = unknown>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options?: {
    invalidateKeys?: string[][];
    onSuccess?: (data: ApiResponse<T>) => void;
    onError?: (error: ApiError) => void;
  }
) {
  const queryClient = useQueryClient();
  
  return useMutation<ApiResponse<T>, ApiError, D>({
    mutationFn: (data) =>
      request<T>(endpoint, {
        method,
        body: data ? JSON.stringify(data) : undefined,
      }),
    onSuccess: (data) => {
      // 自动刷新相关查询
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

export type { ApiResponse, ApiError, RequestConfig };
export { buildUrl };
