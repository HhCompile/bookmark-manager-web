/**
 * 书签相关 API
 */

import { api, useApiQuery, useApiMutation } from './client';
import type { Bookmark, BookmarkFolder } from '../types/bookmark';
import type { ApiResponse } from './client';

// 书签列表查询
export function useBookmarksQuery(params?: { 
  folderId?: string; 
  search?: string;
  tag?: string;
}) {
  return useApiQuery<Bookmark[]>(
    ['bookmarks', params?.folderId || 'all', params?.search || '', params?.tag || ''],
    '/bookmarks',
    { params }
  );
}

// 单个书签查询
export function useBookmarkQuery(id: string) {
  return useApiQuery<Bookmark>(
    ['bookmark', id],
    `/bookmarks/${id}`,
    {},
    { enabled: !!id }
  );
}

// 创建书签
export function useCreateBookmark() {
  return useApiMutation<Bookmark, Omit<Bookmark, 'id' | 'addedDate'>>('/bookmarks', 'POST', {
    invalidateKeys: [['bookmarks']],
  });
}

// 更新书签
export function useUpdateBookmark(id: string) {
  return useApiMutation<Bookmark, Partial<Bookmark>>(`/bookmarks/${id}`, 'PUT', {
    invalidateKeys: [['bookmarks'], ['bookmark', id]],
  });
}

// 删除书签
export function useDeleteBookmark() {
  return useApiMutation<void, string>('/bookmarks', 'DELETE', {
    invalidateKeys: [['bookmarks']],
  });
}

// 文件夹列表查询
export function useFoldersQuery() {
  return useApiQuery<BookmarkFolder[]>(
    ['folders'],
    '/folders'
  );
}

// 创建文件夹
export function useCreateFolder() {
  return useApiMutation<BookmarkFolder, Omit<BookmarkFolder, 'id'>>('/folders', 'POST', {
    invalidateKeys: [['folders']],
  });
}

// 更新文件夹
export function useUpdateFolder(id: string) {
  return useApiMutation<BookmarkFolder, Partial<BookmarkFolder>>(`/folders/${id}`, 'PUT', {
    invalidateKeys: [['folders']],
  });
}

// 删除文件夹
export function useDeleteFolder() {
  return useApiMutation<void, string>('/folders', 'DELETE', {
    invalidateKeys: [['folders'], ['bookmarks']],
  });
}

// Chrome 书签同步
export function useSyncChromeBookmarks() {
  return useApiMutation<{ count: number }, void>('/sync/chrome', 'POST', {
    invalidateKeys: [['bookmarks'], ['folders']],
  });
}

// HTML 文件导入
export function useImportHtmlBookmarks() {
  return useApiMutation<{ count: number }, { html: string }>('/import/html', 'POST', {
    invalidateKeys: [['bookmarks'], ['folders']],
  });
}

// 直接调用 API（用于非 React 环境）
export const bookmarksApi = {
  getAll: (params?: { folderId?: string; search?: string }) =>
    api.get<Bookmark[]>('/bookmarks', { params }),
    
  getById: (id: string) =>
    api.get<Bookmark>(`/bookmarks/${id}`),
    
  create: (data: Omit<Bookmark, 'id' | 'addedDate'>) =>
    api.post<Bookmark>('/bookmarks', data),
    
  update: (id: string, data: Partial<Bookmark>) =>
    api.put<Bookmark>(`/bookmarks/${id}`, data),
    
  delete: (id: string) =>
    api.delete<void>(`/bookmarks/${id}`),
};

export const foldersApi = {
  getAll: () => api.get<BookmarkFolder[]>('/folders'),
  create: (data: Omit<BookmarkFolder, 'id'>) =>
    api.post<BookmarkFolder>('/folders', data),
  update: (id: string, data: Partial<BookmarkFolder>) =>
    api.put<BookmarkFolder>(`/folders/${id}`, data),
  delete: (id: string) => api.delete<void>(`/folders/${id}`),
};
