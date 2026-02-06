// 环境变量管理工具

// 应用名称
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Bookmark Manager';

// 环境类型
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

// API基础URL
export const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3001/api';

// 调试模式
export const DEBUG = import.meta.env.VITE_APP_DEBUG === 'true';

// 应用版本
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// 是否为生产环境
export const IS_PRODUCTION = APP_ENV === 'production';

// 是否为开发环境
export const IS_DEVELOPMENT = APP_ENV === 'development';

// 环境配置对象
export const env = {
  appName: APP_NAME,
  appEnv: APP_ENV,
  apiBaseUrl: API_BASE_URL,
  debug: DEBUG,
  appVersion: APP_VERSION,
  isProduction: IS_PRODUCTION,
  isDevelopment: IS_DEVELOPMENT
};

export default env;
