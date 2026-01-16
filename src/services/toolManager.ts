/**
 * 工具管理器
 * 根据配置动态调用对应的工具模块
 */

import { appConfig, loadConfig, ToolConfig } from '../config';

// 工具接口定义
export interface Tool {
  id: string;
  name: string;
  execute: (...args: any[]) => Promise<any>;
  validate?: (config: any) => boolean;
  getConfig?: () => any;
  // 添加索引签名，允许工具对象包含额外的方法和属性
  [key: string]: any;
}

// 工具管理器类
class ToolManager {
  private tools: Map<string, Tool> = new Map();
  private configCache: Map<string, ToolConfig> = new Map();

  constructor() {
    // 初始化工具配置缓存
    this.initializeConfigCache();
  }

  /**
   * 初始化配置缓存
   */
  private initializeConfigCache(): void {
    const currentConfig = loadConfig();
    currentConfig.tools.forEach(toolConfig => {
      this.configCache.set(toolConfig.id, toolConfig);
    });
  }

  /**
   * 重新加载配置
   */
  reloadConfig(): void {
    this.initializeConfigCache();
    console.log('配置已重新加载');
  }

  /**
   * 注册工具
   * @param tool 工具实例
   */
  registerTool(tool: Tool): void {
    this.tools.set(tool.id, tool);
  }

  /**
   * 注册多个工具
   * @param tools 工具实例数组
   */
  registerTools(tools: Tool[]): void {
    tools.forEach(tool => this.registerTool(tool));
  }

  /**
   * 获取工具配置
   * @param toolId 工具ID
   * @returns 工具配置
   */
  getToolConfig(toolId: string): ToolConfig | undefined {
    return this.configCache.get(toolId);
  }

  /**
   * 检查工具是否启用
   * @param toolId 工具ID
   * @returns 是否启用
   */
  isToolEnabled(toolId: string): boolean {
    const config = this.getToolConfig(toolId);
    return config?.enabled || false;
  }

  /**
   * 检查工具依赖是否满足
   * @param toolId 工具ID
   * @returns 依赖是否满足
   */
  private checkDependencies(toolId: string): boolean {
    const config = this.getToolConfig(toolId);
    if (!config?.dependencies || config.dependencies.length === 0) {
      return true;
    }

    return config.dependencies.every(dependencyId => {
      const dependencyConfig = this.getToolConfig(dependencyId);
      return dependencyConfig?.enabled || false;
    });
  }

  /**
   * 执行工具
   * @param toolId 工具ID
   * @param args 工具参数
   * @returns 工具执行结果
   */
  async executeTool(toolId: string, ...args: any[]): Promise<any> {
    // 执行前重新加载配置，确保使用最新配置
    this.reloadConfig();

    // 检查工具是否存在
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new Error(`工具 ${toolId} 未注册`);
    }

    // 检查工具是否启用
    if (!this.isToolEnabled(toolId)) {
      throw new Error(`工具 ${toolId} 未启用`);
    }

    // 检查依赖是否满足
    if (!this.checkDependencies(toolId)) {
      throw new Error(`工具 ${toolId} 的依赖未满足`);
    }

    // 获取工具配置
    const config = this.getToolConfig(toolId);

    // 执行工具
    try {
      return await tool.execute(...args, config?.config);
    } catch (error) {
      console.error(`执行工具 ${toolId} 失败:`, error);
      throw error;
    }
  }

  /**
   * 批量执行工具
   * @param toolIds 工具ID数组
   * @param args 工具参数
   * @returns 工具执行结果数组
   */
  async executeTools(
    toolIds: string[],
    ...args: any[]
  ): Promise<Map<string, any>> {
    // 执行前重新加载配置，确保使用最新配置
    this.reloadConfig();

    const results = new Map<string, any>();

    // 按优先级排序
    const sortedToolIds = toolIds
      .map(id => ({ id, priority: this.getToolConfig(id)?.priority || 0 }))
      .sort((a, b) => a.priority - b.priority)
      .map(item => item.id);

    // 依次执行工具
    for (const toolId of sortedToolIds) {
      try {
        if (this.isToolEnabled(toolId) && this.checkDependencies(toolId)) {
          // 直接调用工具的execute方法，避免重复重新加载配置
          const tool = this.tools.get(toolId);
          if (tool) {
            const config = this.getToolConfig(toolId);
            const result = await tool.execute(...args, config?.config);
            results.set(toolId, result);
          }
        }
      } catch (error) {
        console.error(`执行工具 ${toolId} 失败:`, error);
        results.set(toolId, { error: (error as Error).message });
      }
    }

    return results;
  }

  /**
   * 获取所有可用工具
   * @returns 可用工具列表
   */
  getAvailableTools(): Tool[] {
    return Array.from(this.tools.values()).filter(tool =>
      this.isToolEnabled(tool.id)
    );
  }

  /**
   * 获取工具状态
   * @returns 工具状态映射
   */
  getToolStatuses(): Map<
    string,
    { enabled: boolean; dependenciesMet: boolean }
  > {
    const statuses = new Map<
      string,
      { enabled: boolean; dependenciesMet: boolean }
    >();

    this.configCache.forEach((config, toolId) => {
      statuses.set(toolId, {
        enabled: config.enabled,
        dependenciesMet: this.checkDependencies(toolId),
      });
    });

    return statuses;
  }
}

// 导出单例实例
export const toolManager = new ToolManager();
