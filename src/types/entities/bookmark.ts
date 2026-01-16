/**
 * 书签相关类型定义
 * 统一管理所有书签相关的TypeScript类型
 */

/**
 * 书签实体
 */
export interface Bookmark {
  url: string;
  title: string;
  alias?: string;
  description?: string;
  favicon?: string;
  thumbnail?: string;
  tags: string[];
  category?: string;
  isValid: boolean;
  isPrivate?: boolean;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建书签请求DTO
 */
export interface CreateBookmarkDTO {
  url: string;
  title: string;
  alias?: string;
  description?: string;
  tags?: string[];
  category?: string;
  folderId?: string;
}

/**
 * 更新书签请求DTO
 */
export interface UpdateBookmarkDTO {
  title?: string;
  alias?: string;
  description?: string;
  tags?: string[];
  category?: string;
  isValid?: boolean;
  isPrivate?: boolean;
  folderId?: string;
}

/**
 * 书签筛选条件
 */
export interface BookmarkFilters {
  searchTerm?: string;
  category?: string;
  tag?: string;
  validity?: 'valid' | 'invalid' | 'all';
}

/**
 * 书签统计信息
 */
export interface BookmarkStats {
  total: number;
  valid: number;
  invalid: number;
  private: number;
  byCategory: Record<string, number>;
  byTag: Record<string, number>;
}
