/**
 * 书签视图页面 - ahooks 优化版
 * 展示如何使用 ahooks 的各种 hooks
 */

import { useRef } from 'react';
import {
  useRequest,
  useToggle,
  useSetState,
  useDebounceFn,
  useClickAway,
  useKeyPress,
  useUpdateEffect,
  useLocalStorageState,
  useMount,
} from 'ahooks';
import {
  Grid3X3,
  List,
  FolderTree,
  Plus,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { mockBookmarks, mockFolders } from '../../mocks/data';
import VirtualCardView from '@/components/views/VirtualCardView';
import InfiniteListView from '@/components/views/InfiniteListView';
import AISearchBarV2 from '@/components/ai/AISearchBarV2';
import type { SearchFilters } from '@/components/ai/AISearchBarV2';

// 模拟 API 请求
const fetchBookmarks = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockBookmarks;
};

const fetchFolders = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockFolders;
};

type ViewMode = 'grid' | 'list' | 'tree';

export default function BookmarkViewOptimized() {
  // ==================== 状态管理 ====================
  
  // 使用 useLocalStorageState 持久化视图模式
  const [viewMode, setViewMode] = useLocalStorageState<ViewMode>('bookmark-view-mode', {
    defaultValue: 'grid',
  });

  // 使用 useSetState 管理页面状态
  const [state, setState] = useSetState({
    searchQuery: '',
    searchFilters: {} as SearchFilters,
    selectedFolderId: undefined as string | undefined,
  });

  // 使用 useToggle 管理布尔状态
  const [isSettingsOpen, { toggle: toggleSettings, setLeft: closeSettings }] = useToggle(false);

  // ==================== Refs ====================
  const settingsRef = useRef<HTMLDivElement>(null);

  // ==================== 数据请求 ====================

  // 使用 useRequest 获取书签数据
  const { data: bookmarks, loading: isLoadingBookmarks, refresh: refreshBookmarks } = useRequest(
    fetchBookmarks,
    {
      cacheKey: 'bookmarks',
      staleTime: 60000, // 1分钟后过期
    }
  );

  // 使用 useRequest 获取文件夹数据
  const { data: folders } = useRequest(fetchFolders, {
    cacheKey: 'folders',
  });

  // ==================== 事件处理 ====================

  // 点击外部关闭设置面板
  useClickAway(() => {
    closeSettings();
  }, settingsRef);

  // 快捷键
  useKeyPress('ctrl.r', (e) => {
    e.preventDefault();
    refreshBookmarks();
  });

  useKeyPress('ctrl.1', () => setViewMode('grid'));
  useKeyPress('ctrl.2', () => setViewMode('list'));
  useKeyPress('ctrl.3', () => setViewMode('tree'));

  // 防抖刷新
  const { run: debouncedRefresh } = useDebounceFn(refreshBookmarks, {
    wait: 500,
  });

  // ==================== 筛选逻辑 ====================

  const filteredBookmarks = (bookmarks || []).filter((bookmark) => {
    // 文件夹筛选
    if (state.selectedFolderId) {
      const folder = folders?.find((f) => f.id === state.selectedFolderId);
      if (folder?.bookmarks && !folder.bookmarks.includes(bookmark.id || '')) {
        return false;
      }
    }

    // 搜索筛选
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      const matchesSearch =
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        bookmark.alias?.toLowerCase().includes(query) ||
        bookmark.tags.some((t) => t.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // 分类筛选
    if (state.searchFilters.categories?.length > 0) {
      if (!state.searchFilters.categories.includes(bookmark.category || '')) {
        return false;
      }
    }

    // 标签筛选
    if (state.searchFilters.tags?.length > 0) {
      const hasMatchingTag = state.searchFilters.tags.some((tag) =>
        bookmark.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  // ==================== 处理函数 ====================

  const handleSearch = (query: string, filters: SearchFilters) => {
    setState({ searchQuery: query, searchFilters: filters });
  };

  const handleClearSearch = () => {
    setState({ searchQuery: '', searchFilters: {} as SearchFilters });
  };

  const handleFolderSelect = (folderId: string | undefined) => {
    setState({ selectedFolderId: folderId });
  };

  // ==================== 挂载时执行 ====================
  useMount(() => {
    // Bookmark view mounted
  });

  // 只在依赖变化时执行（跳过首次渲染）
  useUpdateEffect(() => {
    // Filter conditions changed
  }, [state.searchQuery, state.selectedFolderId]);

  // ==================== 渲染 ====================

  return (
    <div className="h-full flex flex-col">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">我的书签</h1>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-sm rounded-full">
            {filteredBookmarks.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 视图切换 */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="卡片视图 (Ctrl+1)"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="列表视图 (Ctrl+2)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'tree'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="树形视图 (Ctrl+3)"
            >
              <FolderTree className="w-4 h-4" />
            </button>
          </div>

          {/* 刷新按钮 */}
          <button
            onClick={debouncedRefresh}
            disabled={isLoadingBookmarks}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            title="刷新 (Ctrl+R)"
          >
            <RefreshCw className={`w-5 h-5 ${isLoadingBookmarks ? 'animate-spin' : ''}`} />
          </button>

          {/* 设置按钮 */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={toggleSettings}
              className={`p-2 rounded-lg transition-colors ${
                isSettingsOpen
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* 设置下拉菜单 */}
            {isSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                  显示设置
                </div>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  显示缩略图
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  显示描述
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  紧凑模式
                </button>
              </div>
            )}
          </div>

          {/* 添加按钮 */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            添加书签
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <AISearchBarV2
          bookmarks={bookmarks || []}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="搜索书签... (Ctrl+K)"
        />
      </div>

      {/* 文件夹筛选 */}
      {folders && folders.length > 0 && (
        <div className="px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleFolderSelect(undefined)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                !state.selectedFolderId
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => handleFolderSelect(folder.id)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  state.selectedFolderId === folder.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {folder.name}
                <span className="ml-1 text-xs opacity-60">
                  ({folder.bookmarks?.length || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div className="flex-1 p-6 overflow-hidden">
        {isLoadingBookmarks ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-500">加载中...</p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <VirtualCardView
                bookmarks={filteredBookmarks}
                itemHeight={280}
              />
            )}
            {viewMode === 'list' && (
              <InfiniteListView
                bookmarks={filteredBookmarks}
                pageSize={20}
              />
            )}
            {viewMode === 'tree' && (
              <div className="text-center py-12 text-gray-500">
                树形视图开发中...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
