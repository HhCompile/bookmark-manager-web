/**
 * 优化的书签数据 Hooks
 * 使用 ahooks 的 useRequest 管理数据请求
 * 比直接使用 React Query 更简洁
 */

import { useCallback } from 'react';
import { useRequest, useSetState, useDebounceFn } from 'ahooks';
import type { Bookmark } from '@/types/bookmark';
import { mockBookmarks, mockFolders } from '../mocks/data';

// 模拟 API 请求
const fetchBookmarks = async (filters?: { folderId?: string; search?: string }) => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  let bookmarks = [...mockBookmarks];
  
  // 按文件夹筛选
  if (filters?.folderId) {
    const folder = mockFolders.find((f) => f.id === filters.folderId);
    if (folder?.bookmarks) {
      bookmarks = bookmarks.filter((b) => b.id && folder.bookmarks?.includes(b.id));
    }
  }
  
  // 按搜索词筛选
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    bookmarks = bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(search) ||
        b.url.toLowerCase().includes(search) ||
        b.alias?.toLowerCase().includes(search) ||
        b.tags.some((t) => t.toLowerCase().includes(search))
    );
  }
  
  return bookmarks;
};

const fetchFolders = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockFolders;
};

// ==================== 书签列表 Hook ====================

interface UseBookmarksOptions {
  folderId?: string;
  search?: string;
}

export function useBookmarksList(options?: UseBookmarksOptions) {
  const { data, loading, error, refresh, run } = useRequest(
    () => fetchBookmarks(options),
    {
      refreshDeps: [options?.folderId, options?.search],
      debounceWait: options?.search ? 300 : 0, // 搜索时防抖
    }
  );

  return {
    bookmarks: data || [],
    isLoading: loading,
    error,
    refresh,
    refetch: run,
  };
}

// ==================== 文件夹列表 Hook ====================

export function useFoldersList() {
  const { data, loading, error, refresh } = useRequest(fetchFolders, {
    cacheKey: 'folders', // 缓存结果
  });

  return {
    folders: data || [],
    isLoading: loading,
    error,
    refresh,
  };
}

// ==================== 搜索 Hook（带防抖）====================

export function useBookmarkSearch() {
  const [filters, setFilters] = useSetState<{
    search: string;
    folderId?: string;
    tags: string[];
  }>({
    search: '',
    tags: [],
  });

  // 防抖更新搜索词
  const { run: debouncedSearch } = useDebounceFn(
    (search: string) => {
      setFilters({ search });
    },
    { wait: 300 }
  );

  const { bookmarks, isLoading } = useBookmarksList({
    folderId: filters.folderId,
    search: filters.search,
  });

  return {
    filters,
    setFilters,
    search: filters.search,
    setSearch: debouncedSearch,
    bookmarks,
    isLoading,
    clearSearch: useCallback(() => {
      setFilters({ search: '', tags: [] });
    }, [setFilters]),
  };
}

// ==================== 书签 CRUD Hooks ====================

export function useCreateBookmarkAHooks() {
  const { run, loading } = useRequest(
    async (bookmark: Omit<Bookmark, 'id' | 'addedDate'>) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newBookmark: Bookmark = {
        ...bookmark,
        id: Math.random().toString(36).substring(2, 15),
        addedDate: new Date().toISOString(),
      };
      mockBookmarks.push(newBookmark);
      return newBookmark;
    },
    {
      manual: true,
      onSuccess: () => {
        // Bookmark created successfully
      },
    }
  );

  return { createBookmark: run, isLoading: loading };
}

export function useDeleteBookmarkAHooks() {
  const { run, loading } = useRequest(
    async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockBookmarks.findIndex((b) => b.id === id);
      if (index === -1) throw new Error('Bookmark not found');
      mockBookmarks.splice(index, 1);
    },
    {
      manual: true,
    }
  );

  return { deleteBookmark: run, isLoading: loading };
}

// ==================== 选中状态管理 ====================

export function useBookmarkSelection(bookmarks: Bookmark[]) {
  const [selectedIds, setSelectedIds] = useSetState<Set<string>>(new Set());

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, [setSelectedIds]);

  const selectAll = useCallback(() => {
    if (selectedIds.size === bookmarks.length) {
      setSelectedIds(new Set<string>());
    } else {
      const allIds = bookmarks.map((b) => b.id).filter((id): id is string => !!id);
      setSelectedIds(new Set(allIds));
    }
  }, [bookmarks, selectedIds.size, setSelectedIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set<string>());
  }, [setSelectedIds]);

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isAllSelected: bookmarks.length > 0 && selectedIds.size === bookmarks.length,
    isIndeterminate: selectedIds.size > 0 && selectedIds.size < bookmarks.length,
    toggleSelection,
    selectAll,
    clearSelection,
  };
}
