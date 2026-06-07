/**
 * 书签类型定义
 * 与后端 API 对齐
 * 
 * 数据架构：
 * - Bookmark 内容数据：URL, title, tags, category（存储在 bookmarks.json）
 * - BookmarkMetadata 元数据：alias, folder_id, notes, custom_tags, is_favorite（存储在 metadata.json）
 */

// 书签元数据（用户个性化数据）
export interface BookmarkMetadata {
  url_hash: string;
  alias?: string;           // 用户自定义别名
  folder_id?: string;       // 所属文件夹ID
  custom_tags?: string[];   // 用户自定义标签
  notes?: string;           // 用户备注
  is_favorite?: boolean;    // 是否收藏
  visit_count?: number;     // 访问次数
  last_visited?: string;    // 最后访问时间（ISO格式）
  display_order?: number;   // 显示顺序
  created_at?: string;      // 创建时间
  updated_at?: string;      // 更新时间
}

// 书签内容数据（来自浏览器导出）
export interface BookmarkContent {
  url: string;
  title: string;
  tags: string[];
  category?: string;
  favicon?: string;
  addedDate?: string;       // ISO 格式日期字符串
}

// 完整书签（内容 + 元数据）
export interface Bookmark extends BookmarkContent {
  // 前端扩展字段
  id?: string;              // 由 URL 生成或后端分配
  // 元数据（后端自动合并返回）
  metadata?: BookmarkMetadata;
  
  // 向后兼容的字段（将逐步迁移到 metadata）
  alias?: string;           // 别名，现在存储在 metadata.alias
  isLocked?: boolean;       // 是否锁定，现在存储在 metadata.notes（加密）
  isDead?: boolean;         // 是否死链，现在存储在 metadata 中
  summary?: string;         // 摘要，现在存储在 metadata.notes
  annotations?: string[];   // 批注列表
}

export interface BookmarkFolder {
  id: string;
  name: string;
  parentId?: string;
  children?: string[];      // 子文件夹ID列表
  bookmarks?: string[];     // 书签ID列表（用于前端组织）
}

export interface BookmarkTag {
  name: string;
  count: number;
}

// 视图模式类型
export type ViewMode = 'list' | 'card' | 'tree';

// 书签筛选条件
export interface BookmarkFilter {
  folderId?: string | null;
  searchQuery?: string;
  tags?: string[];
  category?: string;
}

// 书签排序选项
export type BookmarkSortField = 'title' | 'addedDate' | 'url' | 'category';
export type BookmarkSortOrder = 'asc' | 'desc';

export interface BookmarkSort {
  field: BookmarkSortField;
  order: BookmarkSortOrder;
}

// API 响应类型
export interface BookmarksResponse {
  bookmarks: Bookmark[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface BookmarksStatsResponse {
  total: number;
  categories: {
    count: number;
    distribution: Record<string, number>;
  };
  tags: {
    count: number;
    top_tags: Array<[string, number]>;
  };
  issues: {
    untagged: number;
    uncategorized: number;
  };
}
