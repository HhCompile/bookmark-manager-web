/**
 * 应用配置文件
 * 用于定义工具模块的配置和调用规则
 */

// 工具类型定义
export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  dependencies?: string[];
  config?: Record<string, any>;
}

// 配置类型定义
export interface AppConfig {
  tools: ToolConfig[];
  environment: 'development' | 'production' | 'test';
  featureFlags: Record<string, boolean>;
  api: {
    baseUrl: string;
    timeout: number;
  };
}

// 默认配置
const defaultConfig: AppConfig = {
  tools: [
    {
      id: 'bookmarkValidator',
      name: '书签验证器',
      description: '验证书签的有效性',
      enabled: true,
      priority: 10,
      config: {
        maxRetries: 3,
        timeout: 5000,
      },
    },
    {
      id: 'bookmarkImporter',
      name: '书签导入器',
      description: '从文件导入书签',
      enabled: true,
      priority: 20,
      config: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        supportedFormats: ['html', 'json'],
      },
    },
    {
      id: 'aiOptimizer',
      name: 'AI优化器',
      description: '使用AI优化书签',
      enabled: true,
      priority: 30,
      config: {
        autoCategorize: true,
        generateAlias: true,
        extractTags: true,
      },
    },
    {
      id: 'duplicateDetector',
      name: '重复检测',
      description: '检测重复的书签',
      enabled: true,
      priority: 40,
      config: {
        similarityThreshold: 0.8,
      },
    },
    {
      id: 'folderOrganizer',
      name: '文件夹组织',
      description: '自动组织书签到文件夹',
      enabled: false,
      priority: 50,
      dependencies: ['aiOptimizer'],
      config: {
        autoCreateFolders: true,
        maxFolderDepth: 3,
      },
    },
  ],
  environment: 'development',
  featureFlags: {
    enableAI: true,
    enableBatchImport: true,
    enableRealTimeSync: false,
    enableDarkMode: true,
  },
  api: {
    baseUrl: 'http://localhost:9001',
    timeout: 10000,
  },
};

// 读取配置
export const loadConfig = (): AppConfig => {
  try {
    // 1. 尝试从本地存储加载配置
    const storedConfig = localStorage.getItem('appConfig');
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        // 验证配置结构
        if (validateConfig(parsedConfig)) {
          return parsedConfig;
        }
      } catch (error) {
        console.error('解析本地存储配置失败:', error);
      }
    }

    // 2. 尝试从环境变量加载配置
    if (import.meta.env.VITE_APP_CONFIG) {
      try {
        const envConfig = JSON.parse(import.meta.env.VITE_APP_CONFIG);
        if (validateConfig(envConfig)) {
          return envConfig;
        }
      } catch (error) {
        console.error('解析环境变量配置失败:', error);
      }
    }

    // 3. 使用默认配置
    return defaultConfig;
  } catch (error) {
    console.error('加载配置失败，使用默认配置:', error);
    return defaultConfig;
  }
};

/**
 * 验证配置结构
 * @param config 要验证的配置
 * @returns 配置是否有效
 */
const validateConfig = (config: any): config is AppConfig => {
  if (!config || typeof config !== 'object') {
    return false;
  }

  // 验证工具配置
  if (!Array.isArray(config.tools)) {
    return false;
  }

  // 验证每个工具配置
  for (const tool of config.tools) {
    if (
      !tool.id ||
      typeof tool.name !== 'string' ||
      typeof tool.enabled !== 'boolean' ||
      typeof tool.priority !== 'number'
    ) {
      return false;
    }
  }

  // 验证其他必需字段
  return (
    typeof config.environment === 'string' &&
    typeof config.featureFlags === 'object' &&
    typeof config.api === 'object' &&
    typeof config.api.baseUrl === 'string' &&
    typeof config.api.timeout === 'number'
  );
};

/**
 * 保存配置到本地存储
 * @param config 要保存的配置
 */
export const saveConfig = (config: AppConfig): void => {
  try {
    localStorage.setItem('appConfig', JSON.stringify(config));
  } catch (error) {
    console.error('保存配置失败:', error);
  }
};

/**
 * 重新加载配置
 * @returns 新的配置实例
 */
export const reloadConfig = (): AppConfig => {
  const newConfig = loadConfig();
  // 这里可以添加配置变更的通知逻辑
  return newConfig;
};

// 导出配置实例
export const appConfig = loadConfig();
