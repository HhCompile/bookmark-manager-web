/**
 * API响应类型定义
 */

import type { Bookmark } from '../entities/bookmark';

/**
 * 通用API响应结构
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页响应结构
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 上传书签响应
 */
export interface UploadBookmarksResponse {
  message: string;
  filename: string;
  filePath: string;
  processedCount: number;
  successCount: number;
  failedCount: number;
  duplicates: number;
}

/**
 * AI智能分析结果
 */
export interface AIAnalysisResult {
  bookmarkUrl: string;
  bookmarkTitle: string;
  suggestedCategory: string;
  suggestedTags: string[];
  confidence: number;
}

/**
 * 批量AI分析响应
 */
export interface BatchAIAnalysisResponse {
  totalBookmarks: number;
  taggedBookmarks: number;
  classifiedBookmarks: number;
  categories: Array<{ name: string; count: number }>;
  tags: Array<{ name: string; count: number }>;
  results: AIAnalysisResult[];
}

/**
 * 重复书签检测响应
 */
export interface DuplicateDetectionResponse {
  totalDuplicates: number;
  duplicateGroups: DuplicateGroup[];
}

/**
 * 重复书签组
 */
export interface DuplicateGroup {
  id: string;
  bookmarks: Bookmark[];
  similarity: number;
  urlPattern: string;
}

/**
 * 导出书签响应
 */
export interface ExportBookmarksResponse {
  message: string;
  downloadUrl?: string;
  format: string;
  exportedCount: number;
}

/**
 * 健康度评分响应
 */
export interface HealthScoreResponse {
  overallScore: number;
  validityScore: number;
  completenessScore: number;
  organizationScore: number;
  recommendations: string[];
}
