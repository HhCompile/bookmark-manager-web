/**
 * 书签验证器工具
 * 验证书签的有效性
 */

import { Tool } from '../toolManager';
import { apiService } from '../api';

// 书签验证器工具实现
export const bookmarkValidator: Tool = {
  id: 'bookmarkValidator',
  name: '书签验证器',

  /**
   * 执行书签验证
   * @param _bookmarks 书签数组或单个书签（未使用，保留用于工具接口一致性）
   * @param config 工具配置
   * @returns 验证结果
   */
  async execute(_bookmarks: any, config?: any): Promise<any> {
    try {
      // 启动验证任务
      await apiService.startValidation();
      
      // 轮询验证状态，直到完成
      let attempts = 0;
      const maxAttempts = config?.maxRetries || 30;
      const pollInterval = 1000;

      // 初始化验证状态
      let validationStatus = await apiService.getValidationStatus();

      while (attempts < maxAttempts) {
        validationStatus = await apiService.getValidationStatus();
        
        const completedTasks = validationStatus.data.completed_tasks;
        const totalTasks = validationStatus.data.total_tasks;

        if (completedTasks >= totalTasks) {
          break;
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }

      // 获取无效书签
      const invalidBookmarksResponse = await apiService.getInvalidBookmarks();
      
      return {
        validationStatus: validationStatus.data,
        invalidBookmarks: invalidBookmarksResponse.data.bookmarks,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('书签验证失败:', error);
      throw new Error(`书签验证失败: ${(error as Error).message}`);
    }
  },

  /**
   * 验证配置
   * @param config 工具配置
   * @returns 配置是否有效
   */
  validate(config: any): boolean {
    return (
      config &&
      typeof config.maxRetries === 'number' &&
      config.maxRetries > 0 &&
      typeof config.timeout === 'number' &&
      config.timeout > 0
    );
  },

  /**
   * 获取默认配置
   * @returns 默认配置
   */
  getConfig(): any {
    return {
      maxRetries: 3,
      timeout: 5000,
    };
  },
};

export default bookmarkValidator;
