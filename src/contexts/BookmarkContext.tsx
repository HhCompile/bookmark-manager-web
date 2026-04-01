/**
 * Bookmark Context - 使用新的 Hooks API
 * 提供向后兼容的 Context API
 */

import React, { createContext, useContext, ReactNode } from 'react';
import {
  useBookmarks as useBookmarksQuery,
  useFolders as useFoldersQuery,
  useCreateBookmark,
  useUpdateBookmark,
  useDeleteBookmark,
} from '../hooks';
import type { Bookmark, BookmarkFolder, ViewMode } from '../types/bookmark';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  folders: BookmarkFolder[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFolder: string | null;
  setSelectedFolder: (folder: string | null) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'addedDate'>) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  filteredBookmarks: Bookmark[];
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

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
  const { data: bookmarks = [] } = useBookmarksQuery();
  const { data: folders = [] } = useFoldersQuery();
  const createBookmark = useCreateBookmark();
  const updateBookmark = useUpdateBookmark();
  const deleteBookmark = useDeleteBookmark();

  // 使用本地状态
  const [viewMode, setViewMode] = React.useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFolder, setSelectedFolder] = React.useState<string | null>(null);
  
  // 导入的书签状态（临时展示用）
  const [importedBookmarks, setImportedBookmarks] = React.useState<Bookmark[]>([]);

  // 合并书签：如果有导入的书签，优先显示导入的
  const displayBookmarks = React.useMemo(() => {
    if (importedBookmarks.length > 0) {
      return importedBookmarks;
    }
    return bookmarks;
  }, [importedBookmarks, bookmarks]);

  // 过滤书签
  const filteredBookmarks = React.useMemo(() => {
    let result = displayBookmarks;

    // 按文件夹过滤
    if (selectedFolder) {
      const folder = folders.find((f: BookmarkFolder) => f.id === selectedFolder);
      if (folder) {
        result = result.filter((b: Bookmark) => folder.bookmarks.includes(b.id));
      }
    }

    // 按搜索查询过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b: Bookmark) =>
          b.title.toLowerCase().includes(query) ||
          b.url.toLowerCase().includes(query) ||
          b.alias?.toLowerCase().includes(query) ||
          b.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [displayBookmarks, folders, selectedFolder, searchQuery]);

  // 清除导入的书签
  const clearImportedBookmarks = React.useCallback(() => {
    setImportedBookmarks([]);
  }, []);

  const contextValue: BookmarkContextType = {
    bookmarks: displayBookmarks,
    folders,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedFolder,
    setSelectedFolder,
    addBookmark: (bookmark) => createBookmark.mutate(bookmark),
    updateBookmark: (id, updates) => updateBookmark.mutate({ id, data: updates }),
    deleteBookmark: (id) => deleteBookmark.mutate(id),
    filteredBookmarks,
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
