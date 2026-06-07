/**
 * 标签管理 API
 * 与后端 /v1/tags API 对齐
 */

import { api, useApiQuery, useApiMutation } from './client';
import type {
  Tag,
  TagListParams,
  TagListResponse,
  TagDetail,
  TagStats,
  TagSuggestion,
  CreateTagRequest,
  UpdateTagRequest,
  BatchTagOperation,
  AITagSuggestion,
} from '@/types/tag';

// ==================== React Query Hooks ====================

// 标签列表查询
export function useTagsQuery(params?: TagListParams) {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));
  if (params?.parent_id) queryParams.set('parent_id', params.parent_id);
  if (params?.search) queryParams.set('search', params.search);
  if (params?.sort_by) queryParams.set('sort_by', params.sort_by);
  if (params?.include_system !== undefined) {
    queryParams.set('include_system', String(params.include_system));
  }

  return useApiQuery<TagListResponse>(
    ['tags', JSON.stringify(params)],
    `/tags?${queryParams.toString()}`
  );
}

// 标签详情查询
export function useTagQuery(tagId: string) {
  return useApiQuery<TagDetail>(
    ['tag', tagId],
    `/tags/${encodeURIComponent(tagId)}`,
    {},
    { enabled: !!tagId }
  );
}

// 标签统计查询
export function useTagStatsQuery() {
  return useApiQuery<TagStats>(['tags', 'stats'], '/tags/stats');
}

// 标签建议查询（自动补全）
export function useTagSuggestionsQuery(query: string, limit: number = 10) {
  return useApiQuery<{ suggestions: TagSuggestion[] }>(
    ['tags', 'suggestions', query],
    `/tags/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`,
    {},
    { enabled: query.length > 0 }
  );
}

// ==================== Mutations ====================

// 创建标签
export function useCreateTag() {
  return useApiMutation<
    { message: string; tag: Tag },
    CreateTagRequest
  >('/tags', 'POST', {
    invalidateKeys: [['tags'], ['tags', 'stats']],
  });
}

// 更新标签
export function useUpdateTag() {
  return useApiMutation<
    { message: string; tag: Tag },
    { tagId: string } & UpdateTagRequest
  >((data) => `/tags/${encodeURIComponent(data.tagId)}`, 'PUT', {
    invalidateKeys: [['tags'], ['tag'], ['tags', 'stats']],
  });
}

// 删除标签
export function useDeleteTag() {
  return useApiMutation<
    { message: string },
    { tagId: string; migrateTo?: string }
  >(
    (data) =>
      `/tags/${encodeURIComponent(data.tagId)}${
        data.migrateTo ? `?migrate_to=${encodeURIComponent(data.migrateTo)}` : ''
      }`,
    'DELETE',
    {
      invalidateKeys: [['tags'], ['tag'], ['tags', 'stats'], ['bookmarks']],
    }
  );
}

// 合并标签
export function useMergeTags() {
  return useApiMutation<
    { message: string; tag: Tag },
    { sourceTagId: string; targetTagId: string }
  >(
    (data) => `/tags/${encodeURIComponent(data.sourceTagId)}/merge`,
    'POST',
    {
      invalidateKeys: [['tags'], ['tag'], ['tags', 'stats'], ['bookmarks']],
    }
  );
}

// 批量操作书签标签
export function useBatchTagOperation() {
  return useApiMutation<
    { message: string; updated: number },
    BatchTagOperation
  >('/tags/batch-apply', 'POST', {
    invalidateKeys: [['bookmarks'], ['tags', 'stats']],
  });
}

// 为书签添加标签
export function useAddTagsToBookmark() {
  return useApiMutation<
    { message: string },
    { url: string; tags: string[]; source?: 'manual' | 'ai' }
  >(
    (data) => `/bookmarks/${encodeURIComponent(data.url)}/tags`,
    'POST',
    {
      invalidateKeys: [['bookmarks'], ['tag'], ['tags', 'stats']],
    }
  );
}

// 从书签移除标签
export function useRemoveTagFromBookmark() {
  return useApiMutation<
    { message: string },
    { url: string; tagName: string }
  >(
    (data) =>
      `/bookmarks/${encodeURIComponent(data.url)}/tags/${encodeURIComponent(
        data.tagName
      )}`,
    'DELETE',
    {
      invalidateKeys: [['bookmarks'], ['tag'], ['tags', 'stats']],
    }
  );
}

// ==================== AI 标签建议 ====================

// 获取 AI 标签建议
export function useAITagSuggestionsMutation() {
  return useApiMutation<
    { suggestions: AITagSuggestion[] },
    { url: string; title: string; content?: string }
  >('/tags/suggestions', 'POST');
}

// ==================== 直接调用 API ====================

export const tagsApi = {
  // 标签列表
  getList: (params?: TagListParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', String(params.page));
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.parent_id) queryParams.set('parent_id', params.parent_id);
    if (params?.search) queryParams.set('search', params.search);
    if (params?.sort_by) queryParams.set('sort_by', params.sort_by);

    return api.get<TagListResponse>(`/tags?${queryParams.toString()}`);
  },

  // 标签详情
  getById: (tagId: string) => api.get<TagDetail>(`/tags/${encodeURIComponent(tagId)}`),

  // 创建标签
  create: (data: CreateTagRequest) =>
    api.post<{ message: string; tag: Tag }>('/tags', data),

  // 更新标签
  update: (tagId: string, data: UpdateTagRequest) =>
    api.put<{ message: string; tag: Tag }>(`/tags/${encodeURIComponent(tagId)}`, data),

  // 删除标签
  delete: (tagId: string, migrateTo?: string) =>
    api.delete<{ message: string }>(
      `/tags/${encodeURIComponent(tagId)}${
        migrateTo ? `?migrate_to=${encodeURIComponent(migrateTo)}` : ''
      }`
    ),

  // 合并标签
  merge: (sourceTagId: string, targetTagId: string) =>
    api.post<{ message: string; tag: Tag }>(
      `/tags/${encodeURIComponent(sourceTagId)}/merge`,
      { target_tag_id: targetTagId }
    ),

  // 标签统计
  getStats: () => api.get<TagStats>('/tags/stats'),

  // 标签建议
  getSuggestions: (query: string, limit: number = 10) =>
    api.get<{ suggestions: TagSuggestion[] }>(
      `/tags/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`
    ),

  // 批量操作
  batchApply: (data: BatchTagOperation) =>
    api.post<{ message: string; updated: number }>('/tags/batch-apply', data),

  // AI 标签建议
  getAISuggestions: (data: { url: string; title: string; content?: string }) =>
    api.post<{ suggestions: AITagSuggestion[] }>('/tags/ai-suggestions', data),
};
