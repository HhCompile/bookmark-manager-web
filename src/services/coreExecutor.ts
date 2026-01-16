/**
 * 核心功能执行器
 * 实现配置驱动的工具调用流程，确保每次执行核心功能前自动读取配置
 */

import { toolManager } from './toolManager';
import { loadConfig } from '../config';

/**
 * 核心功能执行器类
 * 负责根据配置驱动工具调用流程
 */
class CoreExecutor {
  /**
   * 执行核心功能
   * @param featureId 功能ID
   * @param toolIds 需要执行的工具ID列表
   * @param args 工具执行参数
   * @returns 执行结果
   */
  async executeFeature(featureId: string, toolIds: string[], ...args: any[]): Promise<Map<string, any>> {
    console.log(`开始执行核心功能: ${featureId}`);
    
    // 1. 加载最新配置
    const config = loadConfig();
    console.log('已加载配置:', {
      environment: config.environment,
      toolsCount: config.tools.length,
      featureFlags: config.featureFlags
    });
    
    // 2. 验证功能是否启用
    if (!this.isFeatureEnabled(featureId, config)) {
      throw new Error(`功能 ${featureId} 未启用`);
    }
    
    // 3. 执行工具
    try {
      const results = await toolManager.executeTools(toolIds, ...args);
      console.log(`核心功能 ${featureId} 执行完成`, results);
      return results;
    } catch (error) {
      console.error(`执行核心功能 ${featureId} 失败:`, error);
      throw error;
    }
  }
  
  /**
   * 执行单个工具
   * @param toolId 工具ID
   * @param args 工具执行参数
   * @returns 执行结果
   */
  async executeTool(toolId: string, ...args: any[]): Promise<any> {
    console.log(`开始执行工具: ${toolId}`);
    
    // 1. 加载最新配置
    const config = loadConfig();
    console.log('已加载配置:', {
      environment: config.environment
    });
    
    // 2. 执行工具
    try {
      const result = await toolManager.executeTool(toolId, ...args);
      console.log(`工具 ${toolId} 执行完成`, result);
      return result;
    } catch (error) {
      console.error(`执行工具 ${toolId} 失败:`, error);
      throw error;
    }
  }
  
  /**
   * 检查功能是否启用
   * @param featureId 功能ID
   * @param config 应用配置
   * @returns 是否启用
   */
  private isFeatureEnabled(featureId: string, config: any): boolean {
    // 检查特性标志
    if (config.featureFlags && config.featureFlags[featureId] !== undefined) {
      return config.featureFlags[featureId];
    }
    
    // 默认启用核心功能
    return true;
  }
  
  /**
   * 获取功能相关的工具列表
   * @param featureId 功能ID
   * @returns 工具ID列表
   */
  getFeatureTools(featureId: string): string[] {
    // 根据功能ID返回相关的工具列表
    // 这里可以根据具体功能定义对应的工具组合
    const featureToolMap: Record<string, string[]> = {
      'bookmarkManagement': ['bookmarkValidator', 'aiOptimizer', 'duplicateDetector'],
      'bookmarkImport': ['bookmarkImporter', 'bookmarkValidator', 'aiOptimizer'],
      'bookmarkOptimization': ['aiOptimizer', 'duplicateDetector', 'folderOrganizer'],
      'bookmarkValidation': ['bookmarkValidator']
    };
    
    return featureToolMap[featureId] || [];
  }
}

// 导出单例实例
export const coreExecutor = new CoreExecutor();

/**
 * 核心功能执行器工厂函数
 * 用于创建核心功能执行器实例
 * @returns 核心功能执行器实例
 */
export const createCoreExecutor = (): CoreExecutor => {
  return new CoreExecutor();
};
