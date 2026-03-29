/**
 * AI 相关 API
 */

import { api, useApiQuery, useApiMutation } from './client';

// AI 建议类型
export interface AISuggestion {
  id: string;
  bookmarkId: string;
  bookmarkTitle: string;
  originalCategory?: string;
  suggestedCategory: string;
  suggestedAlias?: string;
  suggestedTags: string[];
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

// AI 分析结果
export interface AIAnalysisResult {
  bookmarkId: string;
  title: string;
  category: string;
  tags: string[];
  alias?: string;
  summary?: string;
}

// 获取 AI 建议
export function useAISuggestionsQuery() {
  return useApiQuery<AISuggestion[]>(
    ['ai', 'suggestions'],
    '/ai/suggestions'
  );
}

// 分析书签
export function useAnalyzeBookmark() {
  return useApiMutation<AIAnalysisResult, { bookmarkId: string; url: string; title: string }>(
    '/ai/analyze',
    'POST'
  );
}

// 批量分析书签
export function useAnalyzeBookmarksBatch() {
  return useApiMutation<AIAnalysisResult[], { bookmarkIds: string[] }>(
    '/ai/analyze/batch',
    'POST'
  );
}

// 接受 AI 建议
export function useAcceptAISuggestion() {
  return useApiMutation<void, string>(
    '/ai/suggestions/accept',
    'POST',
    {
      invalidateKeys: [['ai', 'suggestions'], ['bookmarks']],
    }
  );
}

// 拒绝 AI 建议
export function useRejectAISuggestion() {
  return useApiMutation<void, string>(
    '/ai/suggestions/reject',
    'POST',
    {
      invalidateKeys: [['ai', 'suggestions']],
    }
  );
}

// 接受所有高置信度建议
export function useAcceptAllHighConfidence() {
  return useApiMutation<{ accepted: number }, void>(
    '/ai/suggestions/accept-all',
    'POST',
    {
      invalidateKeys: [['ai', 'suggestions'], ['bookmarks']],
    }
  );
}

// 直接调用 API
export const aiApi = {
  getSuggestions: () => api.get<AISuggestion[]>('/ai/suggestions'),
  analyze: (bookmarkId: string, url: string, title: string) =>
    api.post<AIAnalysisResult>('/ai/analyze', { bookmarkId, url, title }),
  analyzeBatch: (bookmarkIds: string[]) =>
    api.post<AIAnalysisResult[]>('/ai/analyze/batch', { bookmarkIds }),
  acceptSuggestion: (id: string) =>
    api.post<void>(`/ai/suggestions/${id}/accept`),
  rejectSuggestion: (id: string) =>
    api.post<void>(`/ai/suggestions/${id}/reject`),
  acceptAllHighConfidence: () =>
    api.post<{ accepted: number }>('/ai/suggestions/accept-all'),
};
