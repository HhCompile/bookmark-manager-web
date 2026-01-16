/**
 * API请求类型定义
 */

import type { CreateBookmarkDTO, BookmarkFilters } from '../entities/bookmark';

/**
 * 批量创建书签请求
 */
export interface BatchCreateBookmarksRequest {
  bookmarks: CreateBookmarkDTO[];
}

/**
 * 导出书签请求
 */
export interface ExportBookmarksRequest {
  format?: 'html' | 'json' | 'csv';
  includePrivate?: boolean;
  folderStructure?: Record<string, string>;
}

/**
 * 上传书签文件请求
 */
export interface UploadBookmarksRequest {
  file: File;
  options?: {
    autoClassify?: boolean;
    autoTag?: boolean;
    validateLinks?: boolean;
  };
}

/**
 * 启动验证任务请求
 */
export interface StartValidationRequest {
  bookmarkUrls?: string[];
  method?: 'http-head' | 'http-get' | 'custom';
  maxRetries?: number;
}

/**
 * 重试失败验证任务请求
 */
export interface RetryFailedValidationRequest {
  taskIds: string[];
}

/**
 * 获取书签列表请求
 */
export interface GetBookmarksRequest extends BookmarkFilters {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}
