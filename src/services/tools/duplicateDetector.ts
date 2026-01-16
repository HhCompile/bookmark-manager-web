/**
 * 重复检测工具
 * 检测重复的书签
 */

import { Tool } from '../toolManager';
import { apiService } from '../api';

// 重复书签组接口
interface DuplicateGroup {
  representative: any;
  bookmarks: any[];
  similarityScores: Array<{ bookmark: any; score: number }>;
}

// 重复检测工具实现
export const duplicateDetector: Tool = {
  id: 'duplicateDetector',
  name: '重复检测',

  /**
   * 执行重复检测
   * @param bookmarks 书签数组
   * @param config 工具配置
   * @returns 检测结果
   */
  async execute(bookmarks: any[], config?: any): Promise<any> {
    try {
      // 检查配置
      const similarityThreshold = config?.similarityThreshold ?? 0.8;

      // 获取所有书签（如果没有提供）
      let allBookmarks = bookmarks;
      if (!allBookmarks || allBookmarks.length === 0) {
        const bookmarksResponse = await apiService.getBookmarks();
        allBookmarks = bookmarksResponse.data.bookmarks;
      }

      // 检测重复书签
      const duplicateGroups = duplicateDetector.findDuplicateGroups(
        allBookmarks,
        similarityThreshold
      );

      return {
        duplicateGroups,
        totalDuplicates: duplicateGroups.reduce(
          (sum: number, group: DuplicateGroup) => sum + group.bookmarks.length,
          0
        ),
        uniqueBookmarks:
          allBookmarks.length -
          duplicateGroups.reduce(
            (sum: number, group: DuplicateGroup) => sum + (group.bookmarks.length - 1),
            0
          ),
        similarityThreshold,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('重复检测失败:', error);
      throw new Error(`重复检测失败: ${(error as Error).message}`);
    }
  },

  /**
   * 查找重复书签组
   * @param bookmarks 书签数组
   * @param threshold 相似度阈值
   * @returns 重复书签组
   */
  findDuplicateGroups: function (bookmarks: any[], threshold: number): DuplicateGroup[] {
    const duplicateGroups: DuplicateGroup[] = [];
    const processedIndices = new Set<number>();

    // 对每个书签与其他书签比较
    for (let i = 0; i < bookmarks.length; i++) {
      if (processedIndices.has(i)) continue;

      const currentBookmark = bookmarks[i];
      const group: DuplicateGroup = {
        representative: currentBookmark,
        bookmarks: [currentBookmark],
        similarityScores: [],
      };

      // 与其他未处理的书签比较
      for (let j = i + 1; j < bookmarks.length; j++) {
        if (processedIndices.has(j)) continue;

        const compareBookmark = bookmarks[j];
        const similarity = duplicateDetector.calculateSimilarity(
          currentBookmark,
          compareBookmark
        );

        if (similarity >= threshold) {
          group.bookmarks.push(compareBookmark);
          group.similarityScores.push({
            bookmark: compareBookmark,
            score: similarity,
          });
          processedIndices.add(j);
        }
      }

      // 如果找到重复项，添加到结果中
      if (group.bookmarks.length > 1) {
        duplicateGroups.push(group);
      }

      processedIndices.add(i);
    }

    return duplicateGroups;
  },

  /**
   * 计算两个书签的相似度
   * @param bookmark1 第一个书签
   * @param bookmark2 第二个书签
   * @returns 相似度分数（0-1）
   */
  calculateSimilarity: function (bookmark1: any, bookmark2: any): number {
    let totalScore = 0;
    let scoreCount = 0;

    // 比较标题相似度
    if (bookmark1.title && bookmark2.title) {
      const titleSimilarity = duplicateDetector.stringSimilarity(
        bookmark1.title,
        bookmark2.title
      );
      totalScore += titleSimilarity;
      scoreCount += 1;
    }

    // 比较URL相似度
    if (bookmark1.url && bookmark2.url) {
      const urlSimilarity = duplicateDetector.urlSimilarity(
        bookmark1.url,
        bookmark2.url
      );
      totalScore += urlSimilarity;
      scoreCount += 1;
    }

    // 比较标签相似度
    if (bookmark1.tags && bookmark2.tags) {
      const tagsSimilarity = duplicateDetector.tagsSimilarity(
        bookmark1.tags,
        bookmark2.tags
      );
      totalScore += tagsSimilarity;
      scoreCount += 1;
    }

    // 返回平均相似度
    return scoreCount > 0 ? totalScore / scoreCount : 0;
  },

  /**
   * 计算两个字符串的相似度（使用Levenshtein距离的简化实现）
   * @param str1 第一个字符串
   * @param str2 第二个字符串
   * @returns 相似度分数（0-1）
   */
  stringSimilarity: function (str1: string, str2: string): number {
    const lowerStr1 = str1.toLowerCase();
    const lowerStr2 = str2.toLowerCase();

    // 完全相同
    if (lowerStr1 === lowerStr2) return 1;

    // 长度差异过大，相似度低
    const maxLength = Math.max(lowerStr1.length, lowerStr2.length);
    const minLength = Math.min(lowerStr1.length, lowerStr2.length);
    if (maxLength > minLength * 2) return 0;

    // 简单的子串匹配
    if (lowerStr1.includes(lowerStr2) || lowerStr2.includes(lowerStr1)) {
      return minLength / maxLength;
    }

    // 计算共同字符比例
    const commonChars = new Set(
      [...lowerStr1].filter(char => lowerStr2.includes(char))
    );
    return commonChars.size / Math.max(lowerStr1.length, lowerStr2.length);
  },

  /**
   * 计算两个URL的相似度
   * @param url1 第一个URL
   * @param url2 第二个URL
   * @returns 相似度分数（0-1）
   */
  urlSimilarity: function (url1: string, url2: string): number {
    try {
      const urlObj1 = new URL(url1);
      const urlObj2 = new URL(url2);

      // 比较域名
      if (urlObj1.hostname !== urlObj2.hostname) {
        return 0.3; // 不同域名，相似度较低
      }

      // 比较路径
      const path1 = urlObj1.pathname;
      const path2 = urlObj2.pathname;

      // 路径完全相同
      if (path1 === path2) return 1;

      // 计算路径相似度
      return duplicateDetector.stringSimilarity(path1, path2);
    } catch (e) {
      // URL解析失败，使用字符串相似度
      return duplicateDetector.stringSimilarity(url1, url2);
    }
  },

  /**
   * 计算两个标签数组的相似度
   * @param tags1 第一个标签数组
   * @param tags2 第二个标签数组
   * @returns 相似度分数（0-1）
   */
  tagsSimilarity: function (tags1: string[], tags2: string[]): number {
    if (!tags1.length || !tags2.length) return 0;

    // 计算共同标签数量
    const commonTags = tags1.filter(tag => tags2.includes(tag));
    const maxTags = Math.max(tags1.length, tags2.length);

    return commonTags.length / maxTags;
  },

  /**
   * 验证配置
   * @param config 工具配置
   * @returns 配置是否有效
   */
  validate(config: any): boolean {
    return (
      config &&
      typeof config.similarityThreshold === 'number' &&
      config.similarityThreshold >= 0 &&
      config.similarityThreshold <= 1
    );
  },

  /**
   * 获取默认配置
   * @returns 默认配置
   */
  getConfig(): any {
    return {
      similarityThreshold: 0.8,
    };
  },
};

export default duplicateDetector;
