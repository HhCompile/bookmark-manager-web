import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

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
}

export interface BookmarkFolder {
  id: string;
  name: string;
  bookmarks: Bookmark[];
  children?: BookmarkFolder[];
}

interface BookmarkContextType {
  bookmarks: Bookmark[];
  folders: BookmarkFolder[];
  viewMode: 'list' | 'card' | 'tree';
  setViewMode: (mode: 'list' | 'card' | 'tree') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFolder: string | null;
  setSelectedFolder: (folder: string | null) => void;
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'addedDate'>) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  filteredBookmarks: Bookmark[];
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within BookmarkProvider');
  }
  return context;
};

// 模拟数据
const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    title: 'GitHub - React',
    url: 'https://github.com/facebook/react',
    alias: 'gh',
    category: '开发工具',
    tags: ['前端', 'React', '开源'],
    favicon: '🔧',
    isLocked: false,
    addedDate: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    category: '文档',
    tags: ['Web', '文档', '前端'],
    favicon: '📚',
    isLocked: false,
    addedDate: new Date('2024-02-01'),
  },
  {
    id: '3',
    title: '个人笔记 - Notion',
    url: 'https://notion.so/my-notes',
    alias: 'notes',
    category: '工作',
    tags: ['笔记', '生产力'],
    favicon: '🔒',
    isLocked: true,
    addedDate: new Date('2024-03-10'),
  },
];

// 文件夹数据
const defaultFolders: BookmarkFolder[] = [
  { id: '1', name: '开发工具', bookmarks: [] },
  { id: '2', name: '灵感素材', bookmarks: [] },
  { id: '3', name: '工作', bookmarks: [] },
  { id: '4', name: '私密学习库', bookmarks: [] },
];

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks);
  const [folders] = useState<BookmarkFolder[]>(defaultFolders);
  const [viewMode, setViewMode] = useState<'list' | 'card' | 'tree'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // 优化回调函数，避免不必要的重新渲染
  const addBookmark = useCallback((bookmark: Omit<Bookmark, 'id' | 'addedDate'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Date.now().toString(),
      addedDate: new Date(),
    };
    setBookmarks(prevBookmarks => [...prevBookmarks, newBookmark]);
  }, []);

  const updateBookmark = useCallback((id: string, updates: Partial<Bookmark>) => {
    setBookmarks(prevBookmarks => 
      prevBookmarks.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const deleteBookmark = useCallback((id: string) => {
    setBookmarks(prevBookmarks => prevBookmarks.filter(b => b.id !== id));
  }, []);

  // 使用useMemo缓存过滤后的书签，避免重复计算
  const filteredBookmarks = useMemo(() => {
    let result = bookmarks;
    
    // 按文件夹过滤
    if (selectedFolder) {
      const folderName = folders.find(f => f.id === selectedFolder)?.name;
      if (folderName) {
        result = result.filter(b => b.category === folderName);
      }
    }
    
    // 按搜索查询过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query) ||
        b.alias?.toLowerCase().includes(query) ||
        b.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [bookmarks, selectedFolder, searchQuery, folders]);

  // 优化上下文值，避免不必要的重新渲染
  const contextValue = useMemo(() => ({
    bookmarks,
    folders,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedFolder,
    setSelectedFolder,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    filteredBookmarks,
  }), [
    bookmarks, folders, viewMode, searchQuery, selectedFolder,
    addBookmark, updateBookmark, deleteBookmark, filteredBookmarks
  ]);

  return (
    <BookmarkContext.Provider value={contextValue}>
      {children}
    </BookmarkContext.Provider>
  );
};
