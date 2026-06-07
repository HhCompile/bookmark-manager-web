/**
 * 书签相关工具函数
 */

import type { Bookmark } from '@/types/bookmark';

/**
 * 书签状态类型
 */
export interface BookmarkStatus {
  isValid: boolean;
  isDuplicate: boolean;
  isDead: boolean;
  warnings: string[];
}

/**
 * 检查书签状态
 */
export function checkBookmarkStatus(bookmark: Bookmark, allBookmarks: Bookmark[]): BookmarkStatus {
  const warnings: string[] = [];
  
  // 检查必填字段
  if (!bookmark.url) warnings.push('URL 不能为空');
  // title 可能为空字符串，但类型定义中是必填的
  
  // 检查 URL 格式
  const isValid = /^https?:\/\//.test(bookmark.url);
  if (!isValid) warnings.push('URL 格式不正确');
  
  // 检查重复
  const isDuplicate = allBookmarks.some(
    (b) => b.id !== bookmark.id && b.url === bookmark.url
  );
  if (isDuplicate) warnings.push('存在相同 URL 的书签');
  
  return {
    isValid: isValid && warnings.length === 0,
    isDuplicate,
    isDead: bookmark.isDead || false,
    warnings,
  };
}

/**
 * 按分类组织书签
 */
export function groupBookmarksByCategory(bookmarks: Bookmark[]): Map<string, Bookmark[]> {
  const groups = new Map<string, Bookmark[]>();
  
  bookmarks.forEach((bookmark) => {
    const category = bookmark.category || '未分类';
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(bookmark);
  });
  
  return groups;
}

/**
 * 按标签组织书签
 */
export function groupBookmarksByTag(bookmarks: Bookmark[]): Map<string, Bookmark[]> {
  const groups = new Map<string, Bookmark[]>();
  
  bookmarks.forEach((bookmark) => {
    bookmark.tags.forEach((tag) => {
      if (!groups.has(tag)) {
        groups.set(tag, []);
      }
      groups.get(tag)!.push(bookmark);
    });
  });
  
  return groups;
}

/**
 * 提取所有标签
 */
export function extractAllTags(bookmarks: Bookmark[]): string[] {
  const tagSet = new Set<string>();
  bookmarks.forEach((b) => {
    b.tags.forEach((tag) => tagSet.add(tag));
    b.metadata?.custom_tags?.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

/**
 * 提取所有分类
 */
export function extractAllCategories(bookmarks: Bookmark[]): string[] {
  const categorySet = new Set<string>();
  bookmarks.forEach((b) => {
    if (b.category) categorySet.add(b.category);
  });
  return Array.from(categorySet).sort();
}

/**
 * 搜索书签
 */
export function searchBookmarks(
  bookmarks: Bookmark[],
  query: string
): Bookmark[] {
  if (!query.trim()) return bookmarks;
  
  const searchTerm = query.toLowerCase();
  
  return bookmarks.filter((bookmark) => {
    const searchFields = [
      bookmark.title,
      bookmark.url,
      bookmark.alias,
      bookmark.metadata?.notes,
      bookmark.category,
      ...bookmark.tags,
    ].filter(Boolean);
    
    return searchFields.some((field) =>
      String(field).toLowerCase().includes(searchTerm)
    );
  });
}

/**
 * 筛选书签
 */
export interface BookmarkFilters {
  categories?: string[];
  tags?: string[];
  hasAlias?: boolean;
  isFavorite?: boolean;
  isDead?: boolean;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

export type BookmarkSortField = 'title' | 'url' | 'addedDate';

export function filterBookmarks(
  bookmarks: Bookmark[],
  filters: BookmarkFilters
): Bookmark[] {
  return bookmarks.filter((bookmark) => {
    // 分类筛选
    if (filters.categories?.length && !filters.categories.includes(bookmark.category || '')) {
      return false;
    }
    
    // 标签筛选
    if (filters.tags?.length) {
      const hasMatchingTag = filters.tags.some((tag) => bookmark.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    
    // 别名筛选
    if (filters.hasAlias !== undefined) {
      const hasAlias = !!bookmark.alias;
      if (hasAlias !== filters.hasAlias) return false;
    }
    
    // 收藏筛选
    if (filters.isFavorite !== undefined) {
      if ((bookmark.metadata?.is_favorite ?? false) !== filters.isFavorite) return false;
    }
    
    // 失效筛选
    if (filters.isDead !== undefined) {
      if (bookmark.isDead !== filters.isDead) return false;
    }
    
    // 日期范围筛选
    if (filters.dateRange) {
      const date = bookmark.addedDate ? new Date(bookmark.addedDate) : null;
      if (date) {
        if (filters.dateRange.start && date < filters.dateRange.start) return false;
        if (filters.dateRange.end && date > filters.dateRange.end) return false;
      }
    }
    
    return true;
  });
}

/**
 * 排序书签
 */

export type SortOrder = 'asc' | 'desc';

export function sortBookmarks(
  bookmarks: Bookmark[],
  field: BookmarkSortField,
  order: SortOrder = 'desc'
): Bookmark[] {
  return [...bookmarks].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'title':
        comparison = (a.title || '').localeCompare(b.title || '');
        break;
      case 'url':
        comparison = a.url.localeCompare(b.url);
        break;
      case 'addedDate':
        comparison = new Date(a.addedDate || 0).getTime() - new Date(b.addedDate || 0).getTime();
        break;

    }
    
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * 构建书签树
 */
export interface BookmarkTreeNode {
  id: string;
  name: string;
  type: 'folder' | 'bookmark';
  children?: BookmarkTreeNode[];
  bookmark?: Bookmark;
  isExpanded?: boolean;
}

// 重新导出类型
export type { Bookmark };

export function buildBookmarkTree(bookmarks: Bookmark[]): BookmarkTreeNode[] {
  const categoryMap = groupBookmarksByCategory(bookmarks);
  
  return Array.from(categoryMap.entries()).map(([category, items]) => ({
    id: `category-${category}`,
    name: category,
    type: 'folder' as const,
    isExpanded: true,
    children: items.map((bookmark) => ({
      id: bookmark.id || bookmark.url,
      name: bookmark.title,
      type: 'bookmark' as const,
      bookmark,
    })),
  }));
}

/**
 * 扁平化书签树
 */
export function flattenBookmarkTree(nodes: BookmarkTreeNode[]): Bookmark[] {
  const result: Bookmark[] = [];
  
  const traverse = (items: BookmarkTreeNode[]) => {
    items.forEach((item) => {
      if (item.bookmark) {
        result.push(item.bookmark);
      }
      if (item.children) {
        traverse(item.children);
      }
    });
  };
  
  traverse(nodes);
  return result;
}

/**
 * 导出书签为 HTML
 */
export function exportBookmarksToHtml(bookmarks: Bookmark[]): string {
  const bookmarksHtml = bookmarks
    .map((b) => {
      const notesPart = b.metadata?.notes ? `<DD>${b.metadata.notes}` : '';
      return `    <DT><A HREF="${b.url}" ADD_DATE="${new Date(b.addedDate || Date.now()).getTime()}" TAGS="${b.tags.join(',')}">${b.title}</A>\n${notesPart}`;
    })
    .join('\n');
  
  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
${bookmarksHtml}
</DL><p>`;
}

/**
 * 导出书签为 JSON
 */
export function exportBookmarksToJson(bookmarks: Bookmark[]): string {
  return JSON.stringify(bookmarks, null, 2);
}

/**
 * 获取书签统计信息
 */
export function getBookmarkStats(bookmarks: Bookmark[]) {
  const total = bookmarks.length;
  const withAlias = bookmarks.filter((b) => b.alias).length;
  const favorites = bookmarks.filter((b) => b.metadata?.is_favorite).length;
  const dead = bookmarks.filter((b) => b.isDead).length;
  const locked = bookmarks.filter((b) => b.isLocked).length;
  const withNotes = bookmarks.filter((b) => b.metadata?.notes).length;
  
  const categories = extractAllCategories(bookmarks).length;
  const tags = extractAllTags(bookmarks).length;
  
  return {
    total,
    withAlias,
    favorites,
    dead,
    locked,
    withNotes,
    categories,
    tags,
  };
}
