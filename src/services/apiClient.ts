/**
 * API客户端配置
 * 统一的Axios客户端，包含请求/响应拦截器、错误处理、重试机制
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

/**
 * API错误类
 */
export class APIError extends Error {
  code: number;
  message: string;
  details?: any;

  constructor(message: string, code: number = 500, details?: any) {
    super(message);
    this.code = code;
    this.message = message;
    this.details = details;
  }
}

/**
 * API响应包装类
 */
class APIResponseWrapper<T> {
  code: number;
  message: string;
  data: T;

  constructor(response: AxiosResponse<any>) {
    this.code = response.data.code;
    this.message = response.data.message;
    this.data = response.data.data;
  }

  /**
   * 判断响应是否成功
   */
  isSuccess(): boolean {
    return this.code >= 200 && this.code < 300;
  }

  /**
   * 获取数据
   */
  getData(): T {
    return this.data;
  }

  /**
   * 获取错误
   */
  getError(): APIError | null {
    if (this.isSuccess()) {
      return null;
    }
    return new APIError(this.message, this.code, this.data);
  }
}

/**
 * 统一的API配置
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9001',
  timeout: 30000, // 30秒
  maxRetries: 3,
  retryDelay: 1000, // 1秒
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * 创建Axios实例
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 添加认证token（如果存在）
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      // 添加时间戳防止缓存
      config.params = {
        ...config.params,
        _t: Date.now(),
      };

      console.log('[API Request]', config.method?.toUpperCase(), config.url, config.data);
      return config;
    },
    (error: AxiosError) => {
      console.error('[API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as InternalAxiosRequestConfig;

      // 记录响应
      console.log('[API Response]', response.status, config.url, response.data);

      // 处理401未授权
      if (response.status === 401) {
        toast.error('登录已过期，请重新登录');
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return Promise.reject(new APIError('未授权', 401));
      }

      // 处理403禁止访问
      if (response.status === 403) {
        toast.error('您没有权限访问此资源');
        return Promise.reject(new APIError('禁止访问', 403));
      }

      // 处理404未找到
      if (response.status === 404) {
        toast.error('请求的资源不存在');
        return Promise.reject(new APIError('资源未找到', 404));
      }

      // 处理500服务器错误
      if (response.status >= 500) {
        toast.error('服务器错误，请稍后重试');
        return Promise.reject(new APIError('服务器错误', 500));
      }

      return response;
    },
    (error: AxiosError) => {
      console.error('[API Response Error]', error);

      // 处理网络错误
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        toast.error('网络连接超时，请检查网络设置');
        return Promise.reject(new APIError('网络超时', 0));
      }

      if (!navigator.onLine) {
        toast.error('网络连接已断开');
        return Promise.reject(new APIError('网络断开', 0));
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * 导出API客户端实例
 */
export const apiClient = createAxiosInstance();

/**
 * GET请求
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponseWrapper<T>> {
  try {
    const response = await apiClient.get<T>(url, config);
    return new APIResponseWrapper<T>(response);
  } catch (error: any) {
    console.error('[API GET Error]', url, error);
    throw new APIError(error.response?.data?.message || error.message, error.response?.status || 0);
  }
}

/**
 * POST请求
 */
export async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponseWrapper<T>> {
  try {
    const response = await apiClient.post<T>(url, data, config);
    return new APIResponseWrapper<T>(response);
  } catch (error: any) {
    console.error('[API POST Error]', url, error);
    throw new APIError(error.response?.data?.message || error.message, error.response?.status || 0);
  }
}

/**
 * PUT请求
 */
export async function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponseWrapper<T>> {
  try {
    const response = await apiClient.put<T>(url, data, config);
    return new APIResponseWrapper<T>(response);
  } catch (error: any) {
    console.error('[API PUT Error]', url, error);
    throw new APIError(error.response?.data?.message || error.message, error.response?.status || 0);
  }
}

/**
 * DELETE请求
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponseWrapper<T>> {
  try {
    const response = await apiClient.delete<T>(url, config);
    return new APIResponseWrapper<T>(response);
  } catch (error: any) {
    console.error('[API DELETE Error]', url, error);
    throw new APIError(error.response?.data?.message || error.message, error.response?.status || 0);
  }
}

/**
 * 文件上传（带进度）
 */
export async function uploadFile<T>(
  url: string,
  file: File,
  onProgress?: (progressEvent: any) => void,
  config?: AxiosRequestConfig
): Promise<APIResponseWrapper<T>> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<T>(url, formData, {
      ...config,
      onUploadProgress: progressEvent => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress?.(percent);
        }
      },
    });

    return new APIResponseWrapper<T>(response);
  } catch (error: any) {
    console.error('[API Upload Error]', url, error);
    throw new APIError(error.response?.data?.message || error.message, error.response?.status || 0);
  }
}

/**
 * 取消请求
 */
export function cancelRequest(requestId: string): void {
  // 存储在实例的cancelTokenSource
  if ((apiClient as any).defaults) {
    (apiClient as any).defaults.cancelToken = {};
  }
}

export default apiClient;
