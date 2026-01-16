/**
 * 验证任务相关类型定义
 */

/**
 * 验证任务状态
 */
export type ValidationTaskStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * 验证任务实体
 */
export interface ValidationTask {
  id: string;
  bookmarkUrl: string;
  bookmarkTitle?: string;
  round: number;
  method: string;
  status: ValidationTaskStatus;
  result?: boolean;
  details?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

/**
 * 创建验证任务请求DTO
 */
export interface CreateValidationTaskDTO {
  bookmarkUrl: string;
  bookmarkTitle?: string;
  method?: string;
}

/**
 * 验证进度状态
 */
export interface ValidationProgressStatus {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  failedTasks: number;
  bookmarkStatus: Record<string, BookmarkValidationStatus>;
}

/**
 * 单个书签验证状态
 */
export interface BookmarkValidationStatus {
  title: string;
  totalRounds: number;
  completedRounds: number;
  isValid: boolean;
  tasks: ValidationTask[];
}
