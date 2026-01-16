/**
 * 书签辅助工具函数
 * 提供书签操作的常用工具函数
 */

import type { Bookmark, BookmarkFilters } from '../../types';

/**
 * 提取所有分类
 * @param bookmarks 书签数组
 * @returns 去重的分类名称数组
 */
export function extractCategories(bookmarks: Bookmark[]): string[] {
  return Array.from(
    new Set(
      bookmarks
        .filter(b => b.category)
        .map(b => b.category as string)
    )
  );
}

/**
 * 提取所有标签
 * @param bookmarks 书签数组
 * @returns 去重的标签名称数组
 */
export function extractTags(bookmarks: Bookmark[]): string[] {
  const tagsSet = new Set<string>();

  for (const bookmark of bookmarks) {
    if (bookmark.tags) {
      bookmark.tags.forEach(tag => {
        if (tag) {
          tagsSet.add(tag);
        }
      });
    }
  }

  return Array.from(tagsSet);
}

/**
 * 筛选书签
 * @param bookmarks 书签数组
 * @param filters 筛选条件
 * @returns 筛选后的书签数组
 */
export function filterBookmarks(
  bookmarks: Bookmark[],
  filters: BookmarkFilters
): Bookmark[] {
  let result = [...bookmarks];

  // 搜索过滤
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    result = result.filter(
      b =>
        b.title.toLowerCase().includes(term) ||
        b.url.toLowerCase().includes(term)
    );
  }

  // 分类过滤
  if (filters.category) {
    result = result.filter(b => b.category === filters.category);
  }

  // 标签过滤
  if (filters.tag) {
    result = result.filter(b => b.tags && b.tags.includes(filters.tag!));
  }

  // 有效性过滤
  if (filters.validity && filters.validity !== 'all') {
    if (filters.validity === 'valid') {
      result = result.filter(b => b.isValid);
    } else {
      result = result.filter(b => !b.isValid);
    }
  }

  return result;
}

/**
 * 验证书签URL格式
 * @param url 书签URL
 * @returns 是否为有效URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 生成书签别名
 * @param title 书签标题
 * @param maxLength 最大长度
 * @returns 生成的别名
 */
export function generateAlias(title: string, maxLength: number = 30): string {
  let alias = title
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .toLowerCase();

  // 截断到最大长度
  if (alias.length > maxLength) {
    alias = alias.substring(0, maxLength).replace(/-+$/, ''); // 移除尾部连字符
  }

  return alias;
}

/**
 * 检查URL是否相似
 * @param url1 URL1
 * @param url2 URL2
 * @returns 是否相似
 */
export function isSimilarUrl(url1: string, url2: string): boolean {
  const normalizeUrl = (url: string) => {
    return url
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
  };

  const normalized1 = normalizeUrl(url1);
  const normalized2 = normalizeUrl(url2);

  return normalized1 === normalized2;
}

/**
 * 合并标签（去重并限制数量）
 * @param existingTags 现有标签
 * @param newTags 新标签
 * @param maxTags 最大标签数
 * @returns 合并后的标签数组
 */
export function mergeTags(
  existingTags: string[] = [],
  newTags: string[] = [],
  maxTags: number = 5
): string[] {
  const merged = [...new Set([...existingTags, ...newTags])];
  return merged.slice(0, maxTags);
}

/**
 * 获取域名
 * @param url 书签URL
 * @returns 域名
 */
export function getDomainFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * 按分类统计书签
 * @param bookmarks 书签数组
 * @returns 分类到数量的映射
 */
export function countBookmarksByCategory(bookmarks: Bookmark[]): Record<string, number> {
  const counts: Record<string, number> = {};

  bookmarks.forEach(bookmark => {
    if (bookmark.category) {
      counts[bookmark.category] = (counts[bookmark.category] || 0) + 1;
    }
  });

  return counts;
}

/**
 * 按标签统计书签
 * @param bookmarks 书签数组
 * @returns 标签到使用次数的映射
 */
export function countBookmarksByTag(bookmarks: Bookmark[]): Record<string, number> {
  const counts: Record<string, number> = {};

  bookmarks.forEach(bookmark => {
    if (bookmark.tags) {
      bookmark.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    }
  });

  return counts;
}

/**
 * 计算书签库健康度
 * @param bookmarks 书签数组
 * @returns 健康度评分（0-100）
 */
export function calculateHealthScore(bookmarks: Bookmark[]): number {
  if (bookmarks.length === 0) {
    return 100;
  }

  const totalBookmarks = bookmarks.length;
  const validBookmarks = bookmarks.filter(b => b.isValid).length;
  const categorizedBookmarks = bookmarks.filter(b => b.category).length;
  const taggedBookmarks = bookmarks.filter(b => b.tags && b.tags.length > 0).length;

  // 有效性得分（权重40%）
  const validityScore = (validBookmarks / totalBookmarks) * 40;

  // 分类完整性得分（权重30%）
  const categoryScore = (categorizedBookmarks / totalBookmarks) * 30;

  // 标签覆盖度得分（权重30%）
  const tagScore = (taggedBookmarks / totalBookmarks) * 30;

  return Math.round(validityScore + categoryScore + tagScore);
}
