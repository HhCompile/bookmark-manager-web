/**
 * 书签数据 Hooks
 * 使用 React Query 管理书签数据，对接后端 API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Bookmark, BookmarkFolder } from '@/types/bookmark';
import { api } from '@/api/client';

// Query keys
export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  lists: () => [...bookmarkKeys.all, 'list'] as const,
  list: (filters: { folderId?: string; search?: string }) =>
    [...bookmarkKeys.lists(), filters] as const,
  details: () => [...bookmarkKeys.all, 'detail'] as const,
  detail: (url: string) => [...bookmarkKeys.details(), url] as const,
  folders: ['folders'] as const,
};

// 后端返回的书签数据（可能包含 metadata）
interface BackendBookmark {
  url: string;
  title: string;
  tags: string[];
  category?: string;
  metadata?: {
    url_hash: string;
    alias?: string;
    folder_id?: string;
    custom_tags?: string[];
    notes?: string;
    is_favorite?: boolean;
    visit_count?: number;
    last_visited?: string;
    display_order?: number;
    created_at?: string;
    updated_at?: string;
  };
}

// 将后端书签转换为前端 Bookmark 类型
function toFrontendBookmark(b: BackendBookmark): Bookmark {
  return {
    id: b.url, // 用 url 作为 id
    url: b.url,
    title: b.title,
    tags: b.tags,
    category: b.category,
    alias: b.metadata?.alias,
    summary: b.metadata?.notes,
    addedDate: b.metadata?.created_at,
    metadata: b.metadata ? {
      url_hash: b.metadata.url_hash,
      alias: b.metadata.alias,
      folder_id: b.metadata.folder_id,
      custom_tags: b.metadata.custom_tags,
      notes: b.metadata.notes,
      is_favorite: b.metadata.is_favorite,
      visit_count: b.metadata.visit_count,
      last_visited: b.metadata.last_visited,
      display_order: b.metadata.display_order,
      created_at: b.metadata.created_at,
      updated_at: b.metadata.updated_at,
    } : undefined,
  };
}

// 获取书签列表
export function useBookmarks(filters?: { folderId?: string; search?: string }) {
  return useQuery({
    queryKey: bookmarkKeys.list(filters || {}),
    queryFn: async () => {
      const response = await api.get<{
        bookmarks: BackendBookmark[];
        pagination: { page: number; limit: number; total: number; pages: number };
      }>('/bookmarks', { params: { limit: 100 } });

      let bookmarks = response.data.bookmarks.map(toFrontendBookmark);

      // 按文件夹筛选（前端过滤，后端暂不支持 folderId 筛选）
      if (filters?.folderId) {
        bookmarks = bookmarks.filter(
          (b) => b.metadata?.folder_id === filters.folderId
        );
      }

      // 按搜索词筛选（前端过滤）
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
      const response = await api.get<BookmarkFolder[]>('/folders');
      return response.data;
    },
  });
}

// 创建书签
export function useCreateBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookmark: Omit<Bookmark, 'id' | 'addedDate'>) => {
      const response = await api.post<{ message: string; bookmark: BackendBookmark }>('/bookmark', {
        url: bookmark.url,
        title: bookmark.title,
        tags: bookmark.tags,
        category: bookmark.category,
        alias: bookmark.alias,
        notes: bookmark.summary,
      });
      return toFrontendBookmark(response.data.bookmark);
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
      // id 就是 url
      const response = await api.post<{ message: string; bookmark: BackendBookmark }>('/bookmark/update', {
        url: id,
        title: data.title,
        tags: data.tags,
        category: data.category,
        alias: data.alias || data.metadata?.alias,
        notes: data.summary || data.metadata?.notes,
        folder_id: data.metadata?.folder_id,
        custom_tags: data.metadata?.custom_tags,
        is_favorite: data.metadata?.is_favorite,
      });
      return toFrontendBookmark(response.data.bookmark);
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
      // id 就是 url
      await api.post('/bookmark/delete', { url: id });
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
      const response = await api.post<{ message: string; folder: BookmarkFolder }>('/folders', {
        name: folder.name,
        parentId: folder.parentId,
      });
      return response.data.folder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.folders });
    },
  });
}
