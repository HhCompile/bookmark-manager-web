/**
 * 书签类型定义
 */

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  alias?: string;
  category?: string;
  tags: string[];
  favicon?: string;
  isLocked: boolean;
  addedDate: Date;
  annotations?: string[];
  highlights?: string[];
  isDead?: boolean;
  summary?: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  parentId?: string;
  bookmarks: string[];
  children?: BookmarkFolder[];
}

export interface BookmarkTag {
  id: string;
  name: string;
  color?: string;
  count: number;
}

// 视图模式类型
export type ViewMode = 'list' | 'card' | 'tree';

// 书签筛选条件
export interface BookmarkFilter {
  folderId?: string | null;
  searchQuery?: string;
  tags?: string[];
  isLocked?: boolean;
}

// 书签排序选项
export type BookmarkSortField = 'title' | 'addedDate' | 'url' | 'category';
export type BookmarkSortOrder = 'asc' | 'desc';

export interface BookmarkSort {
  field: BookmarkSortField;
  order: BookmarkSortOrder;
}
