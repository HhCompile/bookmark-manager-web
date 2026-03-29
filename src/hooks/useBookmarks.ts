/**
 * 书签数据 Hooks
 * 使用 React Query 管理书签数据
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Bookmark, BookmarkFolder } from '../types/bookmark';
import { mockBookmarks, mockFolders } from '../mocks/data';

// Query keys
export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  lists: () => [...bookmarkKeys.all, 'list'] as const,
  list: (filters: { folderId?: string; search?: string }) =>
    [...bookmarkKeys.lists(), filters] as const,
  details: () => [...bookmarkKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookmarkKeys.details(), id] as const,
  folders: ['folders'] as const,
};

// 获取书签列表
export function useBookmarks(filters?: { folderId?: string; search?: string }) {
  return useQuery({
    queryKey: bookmarkKeys.list(filters || {}),
    queryFn: async () => {
      // 模拟 API 延迟
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      let bookmarks = [...mockBookmarks];
      
      // 按文件夹筛选
      if (filters?.folderId) {
        const folder = mockFolders.find((f) => f.id === filters.folderId);
        if (folder) {
          bookmarks = bookmarks.filter((b) => folder.bookmarks.includes(b.id));
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
    },
  });
}

// 获取文件夹列表
export function useFolders() {
  return useQuery({
    queryKey: bookmarkKeys.folders,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockFolders;
    },
  });
}

// 创建书签
export function useCreateBookmark() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookmark: Omit<Bookmark, 'id' | 'addedDate'>) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newBookmark: Bookmark = {
        ...bookmark,
        id: Math.random().toString(36).substring(2, 15),
        addedDate: new Date(),
      };
      mockBookmarks.push(newBookmark);
      return newBookmark;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
}

// 更新书签
export function useUpdateBookmark() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Bookmark> }) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockBookmarks.findIndex((b) => b.id === id);
      if (index === -1) throw new Error('Bookmark not found');
      mockBookmarks[index] = { ...mockBookmarks[index], ...data };
      return mockBookmarks[index];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.detail(variables.id),
      });
    },
  });
}

// 删除书签
export function useDeleteBookmark() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockBookmarks.findIndex((b) => b.id === id);
      if (index === -1) throw new Error('Bookmark not found');
      mockBookmarks.splice(index, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
}

// 创建文件夹
export function useCreateFolder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (folder: Omit<BookmarkFolder, 'id'>) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newFolder: BookmarkFolder = {
        ...folder,
        id: Math.random().toString(36).substring(2, 15),
      };
      mockFolders.push(newFolder);
      return newFolder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.folders });
    },
  });
}
