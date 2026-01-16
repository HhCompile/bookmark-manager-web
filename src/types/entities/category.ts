/**
 * 分类相关类型定义
 */

/**
 * 分类实体
 */
export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  parentId?: string;
  level?: number;
  sort?: number;
  bookmarkCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建分类请求DTO
 */
export interface CreateCategoryDTO {
  name: string;
  icon?: string;
  color?: string;
  parentId?: string;
}

/**
 * 更新分类请求DTO
 */
export interface UpdateCategoryDTO {
  name?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  sort?: number;
}
