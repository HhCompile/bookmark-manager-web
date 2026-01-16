/**
 * AI优化器工具
 * 使用AI优化书签
 */

import { Tool } from '../toolManager';
import { apiService } from '../api';

// AI优化器工具实现
export const aiOptimizer: Tool = {
  id: 'aiOptimizer',
  name: 'AI优化器',

  /**
   * 执行AI优化
   * @param bookmarks 书签数组或单个书签
   * @param config 工具配置
   * @returns 优化结果
   */
  async execute(bookmarks: any, config?: any): Promise<any> {
    try {
      // 检查配置
      const autoCategorize = config?.autoCategorize ?? true;
      const generateAlias = config?.generateAlias ?? true;
      const extractTags = config?.extractTags ?? true;

      // 处理单个书签或书签数组
      const bookmarksArray = Array.isArray(bookmarks) ? bookmarks : [bookmarks];

      // 对每个书签应用AI优化
      const optimizedBookmarks = [];

      for (const bookmark of bookmarksArray) {
        // 构建更新请求
        const updateRequest: any = {};

        if (generateAlias) {
          // 生成别名（这里使用简化实现，实际项目中可能需要调用AI API）
          updateRequest.alias = aiOptimizer.generateAlias(bookmark.title);
        }

        if (extractTags) {
          // 提取标签（这里使用简化实现，实际项目中可能需要调用AI API）
          updateRequest.tags = aiOptimizer.extractTags(
            bookmark.title,
            bookmark.url
          );
        }

        if (autoCategorize) {
          // 自动分类（这里使用简化实现，实际项目中可能需要调用AI API）
          updateRequest.category = aiOptimizer.categorizeBookmark(
            bookmark.title,
            bookmark.url
          );
        }

        // 如果有更新内容，调用API更新书签
        if (Object.keys(updateRequest).length > 0) {
          const updateResponse = await apiService.updateBookmark(
            bookmark.url,
            updateRequest
          );
          optimizedBookmarks.push(updateResponse.data.bookmark);
        } else {
          optimizedBookmarks.push(bookmark);
        }
      }

      return {
        optimizedBookmarks,
        optimizationOptions: {
          autoCategorize,
          generateAlias,
          extractTags,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('AI优化失败:', error);
      throw new Error(`AI优化失败: ${(error as Error).message}`);
    }
  },

  /**
   * 生成书签别名
   * @param title 书签标题
   * @returns 别名
   */
  generateAlias: function (title: string): string {
    // 简化实现：移除特殊字符，转换为小写，用连字符连接
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  },

  /**
   * 提取标签
   * @param title 书签标题
   * @param url 书签URL
   * @returns 标签数组
   */
  extractTags: function (title: string, url: string): string[] {
    // 简化实现：从标题和URL中提取可能的标签
    const tags: string[] = [];

    // 从标题中提取标签
    const titleWords = title.split(/\s+/);
    titleWords.forEach(word => {
      if (word.length > 2 && /^[a-zA-Z]+$/.test(word)) {
        tags.push(word.toLowerCase());
      }
    });

    // 从URL中提取标签（域名和路径）
    try {
      const urlObj = new URL(url);
      const domainParts = urlObj.hostname.split('.');
      domainParts.forEach(part => {
        if (
          part.length > 2 &&
          !['www', 'com', 'org', 'net', 'io'].includes(part)
        ) {
          tags.push(part.toLowerCase());
        }
      });
    } catch (e) {
      // URL解析失败，忽略
    }

    // 去重并限制数量
    return [...new Set(tags)].slice(0, 5);
  },

  /**
   * 分类书签
   * @param title 书签标题
   * @param url 书签URL
   * @returns 分类
   */
  categorizeBookmark: function (title: string, url: string): string {
    // 简化实现：基于关键词和URL模式分类
    const lowerTitle = title.toLowerCase();
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('github.com') || lowerUrl.includes('gitlab.com')) {
      return '开发工具';
    } else if (
      lowerUrl.includes('stackoverflow.com') ||
      lowerUrl.includes('stackexchange.com')
    ) {
      return '技术问答';
    } else if (
      lowerUrl.includes('youtube.com') ||
      lowerUrl.includes('vimeo.com')
    ) {
      return '视频';
    } else if (lowerUrl.includes('news') || lowerUrl.includes('blog')) {
      return '新闻博客';
    } else if (
      lowerTitle.includes('文档') ||
      lowerTitle.includes('docs') ||
      lowerUrl.includes('docs')
    ) {
      return '文档';
    } else if (lowerTitle.includes('教程') || lowerTitle.includes('tutorial')) {
      return '教程';
    } else if (
      lowerUrl.includes('shopping') ||
      lowerUrl.includes('amazon') ||
      lowerUrl.includes('taobao')
    ) {
      return '购物';
    } else {
      return '其他';
    }
  },

  /**
   * 验证配置
   * @param config 工具配置
   * @returns 配置是否有效
   */
  validate: function (config: any): boolean {
    return (
      config &&
      typeof config.autoCategorize === 'boolean' &&
      typeof config.generateAlias === 'boolean' &&
      typeof config.extractTags === 'boolean'
    );
  },

  /**
   * 获取默认配置
   * @returns 默认配置
   */
  getConfig: function (): any {
    return {
      autoCategorize: true,
      generateAlias: true,
      extractTags: true,
    };
  },
};

export default aiOptimizer;
