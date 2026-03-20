import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import type { ChromeBookmark } from '../hooks/useChromeBookmarks';

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
  // Chrome 书签同步
  syncFromChrome: (chromeBookmarks: ChromeBookmark[]) => void;
  isChromeSynced: boolean;
  lastSyncTime: Date | null;
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
  const [folders, setFolders] = useState<BookmarkFolder[]>(defaultFolders);
  const [viewMode, setViewMode] = useState<'list' | 'card' | 'tree'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isChromeSynced, setIsChromeSynced] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

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

  // 从 Chrome 书签同步数据
  const syncFromChrome = useCallback((chromeBookmarks: ChromeBookmark[]) => {
    if (!chromeBookmarks || chromeBookmarks.length === 0) return;

    const newBookmarks: Bookmark[] = [];
    const newFolders: BookmarkFolder[] = [];
    let folderIdCounter = 1;

    // 递归处理 Chrome 书签树
    const processChromeBookmark = (
      chromeItem: ChromeBookmark,
      parentFolderName?: string
    ) => {
      // 如果是文件夹（有 children 没有 url）
      if (chromeItem.children && !chromeItem.url) {
        const folderName = chromeItem.title || '未命名文件夹';
        const folderId = String(folderIdCounter++);
        
        newFolders.push({
          id: folderId,
          name: folderName,
          bookmarks: [],
        });

        // 递归处理子项
        chromeItem.children.forEach(child => {
          processChromeBookmark(child, folderName);
        });
      }
      // 如果是书签（有 url）
      else if (chromeItem.url) {
        // 从 URL 提取域名作为 favicon
        let favicon = '🔖';
        try {
          const url = new URL(chromeItem.url);
          const hostname = url.hostname.toLowerCase();
          if (hostname.includes('github')) favicon = '🐙';
          else if (hostname.includes('google')) favicon = '🔍';
          else if (hostname.includes('youtube')) favicon = '📺';
          else if (hostname.includes('stackoverflow')) favicon = '📚';
          else if (hostname.includes('twitter') || hostname.includes('x.com')) favicon = '🐦';
          else if (hostname.includes('facebook')) favicon = '📘';
          else if (hostname.includes('linkedin')) favicon = '💼';
          else if (hostname.includes('reddit')) favicon = '🔴';
          else if (hostname.includes('medium')) favicon = '📝';
          else if (hostname.includes('notion')) favicon = '📋';
          else if (hostname.includes('figma')) favicon = '🎨';
          else if (hostname.includes('vercel')) favicon = '▲';
          else if (hostname.includes('netlify')) favicon = '🌐';
          else if (hostname.includes('npmjs')) favicon = '📦';
        } catch {
          // 无效 URL，使用默认图标
        }

        newBookmarks.push({
          id: `chrome-${chromeItem.id}`,
          title: chromeItem.title || '无标题',
          url: chromeItem.url,
          category: parentFolderName,
          tags: parentFolderName ? [parentFolderName] : ['未分类'],
          favicon,
          isLocked: false,
          addedDate: new Date(chromeItem.dateAdded || Date.now()),
        });
      }
    };

    // 处理根节点下的所有书签
    chromeBookmarks.forEach(root => {
      if (root.children) {
        root.children.forEach(child => processChromeBookmark(child));
      }
    });

    // 如果没有找到文件夹，创建一个默认文件夹
    if (newFolders.length === 0) {
      newFolders.push({
        id: 'default',
        name: 'Chrome 书签',
        bookmarks: [],
      });
      // 将所有书签归类到默认文件夹
      newBookmarks.forEach(b => {
        if (!b.category) {
          b.category = 'Chrome 书签';
          b.tags = ['Chrome 书签'];
        }
      });
    }

    setBookmarks(prev => {
      // 过滤掉之前的 Chrome 书签，保留用户手动添加的
      const manualBookmarks = prev.filter(b => !b.id.startsWith('chrome-'));
      return [...manualBookmarks, ...newBookmarks];
    });

    setFolders(prev => {
      // 保留原有的非 Chrome 文件夹
      const manualFolders = prev.filter(f => 
        !['Chrome 书签', '书签栏', '其他书签'].includes(f.name)
      );
      return [...manualFolders, ...newFolders];
    });

    setIsChromeSynced(true);
    setLastSyncTime(new Date());
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
    syncFromChrome,
    isChromeSynced,
    lastSyncTime,
  }), [
    bookmarks, folders, viewMode, searchQuery, selectedFolder,
    addBookmark, updateBookmark, deleteBookmark, filteredBookmarks,
    syncFromChrome, isChromeSynced, lastSyncTime
  ]);

  return (
    <BookmarkContext.Provider value={contextValue}>
      {children}
    </BookmarkContext.Provider>
  );
};
