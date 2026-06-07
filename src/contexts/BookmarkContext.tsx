/**
 * Bookmark Context - 使用新的 Hooks API
 * 提供向后兼容的 Context API
 * 新增：多选功能、批量操作、AI 智能筛选
 */

import React, { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';
import {
  useBookmarks as useBookmarksQuery,
  useFolders as useFoldersQuery,
  useCreateBookmark,
  useUpdateBookmark,
  useDeleteBookmark,
} from '@/hooks';
import type { Bookmark, BookmarkFolder, ViewMode } from '@/types/bookmark';
import type { SearchFilters } from '@/components/ai/AISearchBar';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  folders: BookmarkFolder[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  selectedFolder: string | null;
  setSelectedFolder: (folder: string | null) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'addedDate'>) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  filteredBookmarks: Bookmark[];
  
  // 多选功能
  selectedBookmarks: Set<string>;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
  
  // 导入的书签相关
  importedBookmarks: Bookmark[];
  setImportedBookmarks: (bookmarks: Bookmark[]) => void;
  clearImportedBookmarks: () => void;
  hasImportedBookmarks: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarkContext must be used within BookmarkProvider');
  }
  return context;
};

interface BookmarkProviderProps {
  children: ReactNode;
}

const defaultFilters: SearchFilters = {
  categories: [],
  tags: [],
  hasAlias: null,
  isFavorite: null,
  minVisits: null,
};

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
  const { data: bookmarks = [] } = useBookmarksQuery();
  const { data: folders = [] } = useFoldersQuery();
  const createBookmark = useCreateBookmark();
  const updateBookmark = useUpdateBookmark();
  const deleteBookmark = useDeleteBookmark();

  // UI 状态
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(defaultFilters);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  // 多选状态
  const [selectedBookmarks, setSelectedBookmarks] = useState<Set<string>>(new Set());
  
  // 导入的书签状态
  const [importedBookmarks, setImportedBookmarks] = useState<Bookmark[]>([]);

  // 合并书签
  const displayBookmarks = useMemo(() => {
    if (importedBookmarks.length > 0) {
      return importedBookmarks;
    }
    return bookmarks;
  }, [importedBookmarks, bookmarks]);

  // 过滤书签（支持 AI 智能搜索和筛选）
  const filteredBookmarks = useMemo(() => {
    let result = displayBookmarks;

    // 按文件夹过滤
    if (selectedFolder) {
      const folder = folders.find((f: BookmarkFolder) => f.id === selectedFolder);
      if (folder?.bookmarks) {
        result = result.filter((b: Bookmark) => b.id && folder.bookmarks?.includes(b.id));
      }
    }

    // 按搜索查询过滤（AI 语义搜索）
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((b: Bookmark) => {
        const searchFields = [
          b.title,
          b.url,
          b.alias,
          b.metadata?.alias,
          b.category,
          b.summary,
          b.metadata?.notes,
          ...b.tags,
          ...(b.metadata?.custom_tags || []),
        ].filter(Boolean).map(s => s!.toLowerCase());
        
        return searchFields.some(field => field.includes(query));
      });
    }
    
    // 应用高级筛选
    if (searchFilters.categories.length > 0) {
      result = result.filter(b => searchFilters.categories.includes(b.category || ''));
    }
    
    if (searchFilters.tags.length > 0) {
      result = result.filter(b => {
        const allTags = [...b.tags, ...(b.metadata?.custom_tags || [])];
        return searchFilters.tags.some(tag => allTags.includes(tag));
      });
    }
    
    if (searchFilters.hasAlias !== null) {
      result = result.filter(b => {
        const hasAlias = !!(b.alias || b.metadata?.alias);
        return searchFilters.hasAlias === hasAlias;
      });
    }
    
    if (searchFilters.isFavorite !== null) {
      result = result.filter(b => {
        const isFav = b.metadata?.is_favorite || false;
        return searchFilters.isFavorite === isFav;
      });
    }
    
    if (searchFilters.minVisits !== null) {
      result = result.filter(b => (b.metadata?.visit_count || 0) >= searchFilters.minVisits!);
    }

    return result;
  }, [displayBookmarks, folders, selectedFolder, searchQuery, searchFilters]);

  // 多选操作
  const toggleSelection = useCallback((id: string) => {
    setSelectedBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);
  
  const selectAll = useCallback(() => {
    setSelectedBookmarks(new Set(filteredBookmarks.map(b => b.id || b.url)));
  }, [filteredBookmarks]);
  
  const clearSelection = useCallback(() => {
    setSelectedBookmarks(new Set());
  }, []);
  
  const isSelected = useCallback((id: string) => {
    return selectedBookmarks.has(id);
  }, [selectedBookmarks]);

  // 清除导入的书签
  const clearImportedBookmarks = useCallback(() => {
    setImportedBookmarks([]);
  }, []);

  const contextValue: BookmarkContextType = {
    bookmarks: displayBookmarks,
    folders,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    searchFilters,
    setSearchFilters,
    selectedFolder,
    setSelectedFolder,
    addBookmark: (bookmark) => createBookmark.mutate(bookmark),
    updateBookmark: (id, updates) => updateBookmark.mutate({ id, data: updates }),
    deleteBookmark: (id) => deleteBookmark.mutate(id),
    filteredBookmarks,
    
    // 多选
    selectedBookmarks,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
    
    // 导入
    importedBookmarks,
    setImportedBookmarks,
    clearImportedBookmarks,
    hasImportedBookmarks: importedBookmarks.length > 0,
  };

  return (
    <BookmarkContext.Provider value={contextValue}>
      {children}
    </BookmarkContext.Provider>
  );
};

// 重新导出类型
export type { Bookmark, BookmarkFolder };
