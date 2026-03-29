/**
 * 质量监控相关 API
 */

import { api, useApiQuery, useApiMutation } from './client';

// 重复书签组
export interface DuplicateGroup {
  url: string;
  bookmarks: Array<{
    id: string;
    title: string;
    category: string;
    addedDate: Date;
    tags: string[];
  }>;
}

// 失效链接
export interface DeadLink {
  id: string;
  title: string;
  url: string;
  lastChecked: Date;
  statusCode?: number;
}

// 质量报告
export interface QualityReport {
  totalBookmarks: number;
  duplicateCount: number;
  duplicateGroups: number;
  deadLinkCount: number;
  duplicateRate: number;
  deadLinkRate: number;
  healthScore: number;
}

// 获取重复书签
export function useDuplicateBookmarksQuery() {
  return useApiQuery<DuplicateGroup[]>(
    ['quality', 'duplicates'],
    '/quality/duplicates'
  );
}

// 获取失效链接
export function useDeadLinksQuery() {
  return useApiQuery<DeadLink[]>(
    ['quality', 'dead-links'],
    '/quality/dead-links'
  );
}

// 获取质量报告
export function useQualityReportQuery() {
  return useApiQuery<QualityReport>(
    ['quality', 'report'],
    '/quality/report'
  );
}

// 合并重复书签
export function useMergeBookmarks() {
  return useApiMutation<void, { sourceIds: string[]; targetId: string }>(
    '/quality/merge',
    'POST',
    {
      invalidateKeys: [['quality', 'duplicates'], ['bookmarks']],
    }
  );
}

// 运行质量检查
export function useRunQualityCheck() {
  return useApiMutation<QualityReport, void>(
    '/quality/check',
    'POST',
    {
      invalidateKeys: [['quality']],
    }
  );
}

// 直接调用 API
export const qualityApi = {
  getDuplicates: () => api.get<DuplicateGroup[]>('/quality/duplicates'),
  getDeadLinks: () => api.get<DeadLink[]>('/quality/dead-links'),
  getReport: () => api.get<QualityReport>('/quality/report'),
  merge: (sourceIds: string[], targetId: string) =>
    api.post<void>('/quality/merge', { sourceIds, targetId }),
  check: () => api.post<QualityReport>('/quality/check'),
};
