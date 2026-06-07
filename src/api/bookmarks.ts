/**
 * 书签相关 API
 * 与后端 /v1 API 对齐
 */

import { api, useApiQuery, useApiMutation } from './client';
import type { Bookmark, BookmarkFolder } from '@/types/bookmark';

// ==================== 书签 API ====================

// 书签列表查询（支持分页、筛选）
export function useBookmarksQuery(params?: { 
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
}) {
  return useApiQuery<{
    bookmarks: Bookmark[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>(
    ['bookmarks', String(params?.page || 1), String(params?.limit || 20), params?.category || '', params?.tag || ''],
    '/bookmarks',
    { params }
  );
}

// 单个书签查询 - 通过 URL 查询
export function useBookmarkQuery(url: string) {
  return useApiQuery<Bookmark>(
    ['bookmark', url],
    '/bookmarks',
    { params: { url } },
    { enabled: !!url }
  );
}

// 按分类获取书签
export function useBookmarksByCategoryQuery(category: string) {
  return useApiQuery<{ bookmarks: Bookmark[] }>(
    ['bookmarks', 'category', category],
    `/bookmarks/category/${encodeURIComponent(category)}`,
    {},
    { enabled: !!category }
  );
}

// 按标签获取书签
export function useBookmarksByTagQuery(tag: string) {
  return useApiQuery<{ bookmarks: Bookmark[] }>(
    ['bookmarks', 'tag', tag],
    `/bookmarks/tag/${encodeURIComponent(tag)}`,
    {},
    { enabled: !!tag }
  );
}

// 创建书签
export function useCreateBookmark() {
  return useApiMutation<Bookmark, { url: string; title?: string; tags?: string[]; category?: string }>('/bookmark', 'POST', {
    invalidateKeys: [['bookmarks']],
  });
}

// 批量创建书签
export function useCreateBookmarksBatch() {
  return useApiMutation<{
    message: string;
    processed: number;
    skipped: number;
    bookmarks: Bookmark[];
  }, { bookmarks: Array<{ url: string; title?: string; tags?: string[]; category?: string }> }>('/bookmarks/batch', 'POST', {
    invalidateKeys: [['bookmarks']],
  });
}

// 更新书签 - 使用 POST /bookmark/update
export function useUpdateBookmark() {
  return useApiMutation<Bookmark, { url: string; title?: string; tags?: string[]; category?: string; reprocess?: boolean }>('/bookmark/update', 'POST', {
    invalidateKeys: [['bookmarks']],
  });
}

// 删除书签 - 使用 POST /bookmark/delete
export function useDeleteBookmark() {
  return useApiMutation<void, { url: string }>('/bookmark/delete', 'POST', {
    invalidateKeys: [['bookmarks']],
  });
}

// 上传 HTML 书签文件
export function useUploadBookmarkFile() {
  return useApiMutation<{
    message: string;
    filename: string;
    processed_count: number;
  }, FormData>('/bookmark/upload', 'POST', {
    invalidateKeys: [['bookmarks']],
  });
}

// ==================== 文件夹 API ====================

// 文件夹列表查询
export function useFoldersQuery() {
  return useApiQuery<BookmarkFolder[]>(
    ['folders'],
    '/folders'
  );
}

// 创建文件夹
export function useCreateFolder() {
  return useApiMutation<BookmarkFolder, { name: string; parentId?: string }>('/folders', 'POST', {
    invalidateKeys: [['folders']],
  });
}

// 更新文件夹
export function useUpdateFolder() {
  return useApiMutation<BookmarkFolder, { id: string; name?: string; parentId?: string }>('/folders/update', 'POST', {
    invalidateKeys: [['folders']],
  });
}

// 删除文件夹
export function useDeleteFolder() {
  return useApiMutation<void, { id: string }>('/folders/delete', 'POST', {
    invalidateKeys: [['folders'], ['bookmarks']],
  });
}

// ==================== 批量操作 API ====================

// 批量更新书签
export function useBatchUpdateBookmarks() {
  return useApiMutation<{
    updated: number;
    message: string;
  }, {
    updates: Array<{
      match: { field: string; pattern: string };
      action: { type: string; value?: string };
    }>;
  }>('/bookmarks/batch-update', 'POST', {
    invalidateKeys: [['bookmarks']],
  });
}

// 批量删除书签
export function useBatchDeleteBookmarks() {
  return useApiMutation<{
    deleted: number;
    message: string;
  }, { urls: string[] }>('/bookmarks/batch-delete', 'POST', {
    invalidateKeys: [['bookmarks']],
  });
}

// 导出书签
export function useExportBookmarks() {
  return useApiMutation<{
    format: string;
    count: number;
    data: Bookmark[] | string;
  }, { format: 'json' | 'csv' | 'html'; filter?: { category?: string; tag?: string } }>('/bookmarks/export', 'POST');
}

// 获取书签统计
export function useBookmarksStatsQuery() {
  return useApiQuery<{
    count: number;
    categories: { name: string; count: number }[];
    tags: { name: string; count: number }[];
  }>(
    ['bookmarks', 'stats'],
    '/bookmarks/stats'
  );
}

// ==================== 脚本 API ====================

// 获取已注册的脚本列表
export function useScriptsQuery() {
  return useApiQuery<{
    scripts: Array<{
      name: string;
      description: string;
      parameters: string[];
    }>;
  }>(
    ['scripts'],
    '/scripts'
  );
}

// 解析 HTML 书签文件
export function useParseBookmarks() {
  return useApiMutation<{
    message: string;
    parsed_count: number;
    parsed_data: Bookmark[];
  }, FormData>('/scripts/parse', 'POST');
}

// 分析书签
export function useAnalyzeBookmarks() {
  return useApiMutation<{
    message: string;
    suggestion_count: number;
    suggestions: Array<{
      url: string;
      title: string;
      suggested_category?: string;
      suggested_tags?: string[];
    }>;
  }, { bookmarks: Bookmark[] }>('/scripts/analyze', 'POST');
}

// 解析并分析书签（一步完成）
export function useProcessBookmarks() {
  return useApiMutation<{
    message: string;
    parsed_count: number;
    suggestion_count: number;
    suggestions: Array<{
      url: string;
      title: string;
      suggested_category?: string;
      suggested_tags?: string[];
    }>;
  }, FormData>('/scripts/process', 'POST');
}

// ==================== 直接调用 API ====================

export const bookmarksApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; tag?: string }) =>
    api.get<{
      bookmarks: Bookmark[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>('/bookmarks', { params }),

  getByCategory: (category: string) =>
    api.get<{ bookmarks: Bookmark[] }>(`/bookmarks/category/${encodeURIComponent(category)}`),

  getByTag: (tag: string) =>
    api.get<{ bookmarks: Bookmark[] }>(`/bookmarks/tag/${encodeURIComponent(tag)}`),

  create: (data: { url: string; title?: string; tags?: string[]; category?: string }) =>
    api.post<Bookmark>('/bookmark', data),

  createBatch: (bookmarks: Array<{ url: string; title?: string; tags?: string[]; category?: string }>) =>
    api.post<{
      message: string;
      processed: number;
      skipped: number;
      bookmarks: Bookmark[];
    }>('/bookmarks/batch', { bookmarks }),

  update: (data: { url: string; title?: string; tags?: string[]; category?: string; reprocess?: boolean }) =>
    api.post<Bookmark>('/bookmark/update', data),

  delete: (url: string) =>
    api.post<void>('/bookmark/delete', { url }),

  upload: (formData: FormData) =>
    api.post<{
      message: string;
      filename: string;
      processed_count: number;
    }>('/bookmark/upload', formData),
};

export const foldersApi = {
  getAll: () => api.get<BookmarkFolder[]>('/folders'),
  create: (data: { name: string; parentId?: string }) =>
    api.post<BookmarkFolder>('/folders', data),
  update: (data: { id: string; name?: string; parentId?: string }) =>
    api.post<BookmarkFolder>('/folders/update', data),
  delete: (id: string) => api.post<void>('/folders/delete', { id }),
};

// ==================== 元数据 API ====================

import type { BookmarkMetadata } from '@/types/bookmark';

// 获取书签元数据
export function useBookmarkMetadataQuery(url: string) {
  return useApiQuery<{
    url: string;
    metadata: BookmarkMetadata;
  }>(
    ['bookmark', 'metadata', url],
    `/bookmark/${encodeURIComponent(url)}/metadata`,
    {},
    { enabled: !!url }
  );
}

// 更新书签元数据
export function useUpdateBookmarkMetadata() {
  return useApiMutation<{
    message: string;
    metadata: BookmarkMetadata;
  }, {
    url: string;
    alias?: string;
    folder_id?: string;
    notes?: string;
    custom_tags?: string[];
    is_favorite?: boolean;
  }>((data) => `/bookmark/${encodeURIComponent(data.url)}/metadata`, 'PUT', {
    invalidateKeys: [['bookmarks'], ['bookmark', 'metadata']],
  });
}

// 记录书签访问
export function useRecordBookmarkVisit() {
  return useApiMutation<{
    message: string;
    visit_count: number;
    last_visited: string;
  }, { url: string }>((data) => `/bookmark/${encodeURIComponent(data.url)}/visit`, 'POST');
}

// 获取文件夹中的书签元数据
export function useMetadataByFolderQuery(folderId: string) {
  return useApiQuery<{
    folder_id: string;
    count: number;
    metadata: BookmarkMetadata[];
  }>(
    ['metadata', 'folder', folderId],
    `/metadata/by-folder/${encodeURIComponent(folderId)}`,
    {},
    { enabled: !!folderId }
  );
}

// 获取收藏的书签元数据
export function useFavoriteMetadataQuery() {
  return useApiQuery<{
    count: number;
    metadata: BookmarkMetadata[];
  }>(
    ['metadata', 'favorites'],
    '/metadata/favorites'
  );
}

// 直接调用 API
export const metadataApi = {
  get: (url: string) =>
    api.get<{
      url: string;
      metadata: BookmarkMetadata;
    }>(`/bookmark/${encodeURIComponent(url)}/metadata`),

  update: (url: string, data: {
    alias?: string;
    folder_id?: string;
    notes?: string;
    custom_tags?: string[];
    is_favorite?: boolean;
  }) =>
    api.put<{
      message: string;
      metadata: BookmarkMetadata;
    }>(`/bookmark/${encodeURIComponent(url)}/metadata`, data),

  delete: (url: string) =>
    api.delete<void>(`/bookmark/${encodeURIComponent(url)}/metadata`),

  recordVisit: (url: string) =>
    api.post<{
      message: string;
      visit_count: number;
      last_visited: string;
    }>(`/bookmark/${encodeURIComponent(url)}/visit`, {}),

  getByFolder: (folderId: string) =>
    api.get<{
      folder_id: string;
      count: number;
      metadata: BookmarkMetadata[];
    }>(`/metadata/by-folder/${encodeURIComponent(folderId)}`),

  getFavorites: () =>
    api.get<{
      count: number;
      metadata: BookmarkMetadata[];
    }>('/metadata/favorites'),
};
