/**
 * 文件夹组织工具
 * 自动组织书签到文件夹
 */

import { Tool } from '../toolManager';
import { apiService } from '../api';

// 文件夹组织工具实现
export const folderOrganizer: Tool = {
  id: 'folderOrganizer',
  name: '文件夹组织',

  /**
   * 执行文件夹组织
   * @param bookmarks 书签数组
   * @param config 工具配置
   * @returns 组织结果
   */
  async execute(bookmarks: any[], config?: any): Promise<any> {
    try {
      // 检查配置
      const autoCreateFolders = config?.autoCreateFolders ?? true;
      const maxFolderDepth = config?.maxFolderDepth ?? 3;

      // 获取所有书签（如果没有提供）
      let allBookmarks = bookmarks;
      if (!allBookmarks || allBookmarks.length === 0) {
        const bookmarksResponse = await apiService.getBookmarks();
        allBookmarks = bookmarksResponse.data.bookmarks;
      }

      // 按分类组织书签
      const organizedByCategory =
        folderOrganizer.organizeByCategory(allBookmarks);

      // 构建文件夹结构
      const folderStructure = folderOrganizer.buildFolderStructure(
        organizedByCategory,
        maxFolderDepth
      );

      // 这里可以添加创建文件夹和移动书签的逻辑
      // 由于API可能不支持这些操作，这里只返回组织结果

      return {
        folderStructure,
        organizedBookmarks: organizedByCategory,
        autoCreateFolders,
        maxFolderDepth,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('文件夹组织失败:', error);
      throw new Error(`文件夹组织失败: ${(error as Error).message}`);
    }
  },

  /**
   * 按分类组织书签
   * @param bookmarks 书签数组
   * @returns 按分类组织的书签
   */
  organizeByCategory: function (bookmarks: any[]): Record<string, any[]> {
    const organized: Record<string, any[]> = {};

    bookmarks.forEach(bookmark => {
      const category = bookmark.category || '未分类';

      if (!organized[category]) {
        organized[category] = [];
      }

      organized[category].push(bookmark);
    });

    return organized;
  },

  /**
   * 构建文件夹结构
   * @param organizedBookmarks 按分类组织的书签
   * @param maxDepth 最大文件夹深度
   * @returns 文件夹结构
   */
  buildFolderStructure: function (
    organizedBookmarks: Record<string, any[]>,
    maxDepth: number
  ): any {
    const rootFolder = {
      name: '书签',
      folders: [] as any[],
      bookmarks: [],
    };

    // 为每个分类创建文件夹
    Object.entries(organizedBookmarks).forEach(
      ([category, categoryBookmarks]) => {
        const categoryFolder = {
          name: category,
          folders: [],
          bookmarks: categoryBookmarks,
        };

        // 这里可以根据需要进一步细分文件夹
        // 例如，按域名、标签等

        rootFolder.folders.push(categoryFolder);
      }
    );

    return rootFolder;
  },

  /**
   * 验证配置
   * @param config 工具配置
   * @returns 配置是否有效
   */
  validate(config: any): boolean {
    return (
      config &&
      typeof config.autoCreateFolders === 'boolean' &&
      typeof config.maxFolderDepth === 'number' &&
      config.maxFolderDepth >= 1 &&
      config.maxFolderDepth <= 5
    );
  },

  /**
   * 获取默认配置
   * @returns 默认配置
   */
  getConfig(): any {
    return {
      autoCreateFolders: true,
      maxFolderDepth: 3,
    };
  },
};

export default folderOrganizer;
