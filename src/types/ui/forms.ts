/**
 * 表单相关类型定义
 */


/**
 * 书签表单数据
 */
export interface BookmarkFormData {
  url: string;
  title: string;
  alias?: string;
  description?: string;
  tags: string[];
  category?: string;
  folderId?: string;
}

/**
 * 分类表单数据
 */
export interface CategoryFormData {
  name: string;
  icon?: string;
  color?: string;
  parentId?: string;
}

/**
 * 表单验证规则
 */
export interface ValidationRule<T> {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean | string;
  message?: string;
}

/**
 * 表单验证结果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * 文件上传表单数据
 */
export interface FileUploadFormData {
  file?: File;
  autoClassify: boolean;
  autoTag: boolean;
  validateLinks: boolean;
  folderMapping?: Record<string, string>;
}

/**
 * 设置表单数据
 */
export interface SettingsFormData {
  theme: string;
  language: string;
  pageSize: number;
  autoBackup: boolean;
  notifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}
