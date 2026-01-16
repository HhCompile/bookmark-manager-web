/**
 * 书签导入器工具
 * 从文件导入书签
 */

import { Tool } from '../toolManager';
import { apiService } from '../api';

// 书签导入器工具实现
export const bookmarkImporter: Tool = {
  id: 'bookmarkImporter',
  name: '书签导入器',

  /**
   * 执行书签导入
   * @param file 文件对象
   * @param config 工具配置
   * @returns 导入结果
   */
  async execute(file: File, config?: any): Promise<any> {
    try {
      // 检查文件大小
      const maxFileSize = config?.maxFileSize || 10 * 1024 * 1024; // 默认10MB
      if (file.size > maxFileSize) {
        throw new Error(`文件大小超过限制 (${(maxFileSize / (1024 * 1024)).toFixed(1)}MB)`);
      }

      // 检查文件格式
      const supportedFormats = config?.supportedFormats || ['html', 'json'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!fileExtension || !supportedFormats.includes(fileExtension)) {
        throw new Error(`不支持的文件格式。支持的格式: ${supportedFormats.join(', ')}`);
      }

      // 上传文件
      const uploadResponse = await apiService.uploadBookmarkFile(file);
      
      // 获取导入结果
      return {
        message: uploadResponse.data.message,
        filename: uploadResponse.data.filename,
        filePath: uploadResponse.data.file_path,
        processedCount: uploadResponse.data.processed_count,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('书签导入失败:', error);
      throw new Error(`书签导入失败: ${(error as Error).message}`);
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
      typeof config.maxFileSize === 'number' &&
      config.maxFileSize > 0 &&
      Array.isArray(config.supportedFormats) &&
      config.supportedFormats.length > 0
    );
  },

  /**
   * 获取默认配置
   * @returns 默认配置
   */
  getConfig(): any {
    return {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      supportedFormats: ['html', 'json'],
    };
  },
};

export default bookmarkImporter;
