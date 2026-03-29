/**
 * 数据分析相关 API
 */

import { api, useApiQuery } from './client';

// 标签统计
export interface TagStats {
  name: string;
  count: number;
  percentage: number;
}

// 分类统计
export interface CategoryStats {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

// 趋势数据
export interface TrendData {
  date: string;
  count: number;
}

// 获取标签统计
export function useTagStatsQuery() {
  return useApiQuery<TagStats[]>(
    ['analytics', 'tags'],
    '/analytics/tags'
  );
}

// 获取分类统计
export function useCategoryStatsQuery() {
  return useApiQuery<CategoryStats[]>(
    ['analytics', 'categories'],
    '/analytics/categories'
  );
}

// 获取趋势数据
export function useTrendsQuery(period: 'week' | 'month' | 'year' = 'month') {
  return useApiQuery<TrendData[]>(
    ['analytics', 'trends', period],
    '/analytics/trends',
    { params: { period } }
  );
}

// 直接调用 API
export const analyticsApi = {
  getTagStats: () => api.get<TagStats[]>('/analytics/tags'),
  getCategoryStats: () => api.get<CategoryStats[]>('/analytics/categories'),
  getTrends: (period: 'week' | 'month' | 'year' = 'month') =>
    api.get<TrendData[]>('/analytics/trends', { params: { period } }),
};
